from PySide6.QtWidgets import QDialog, QVBoxLayout, QPushButton, QHBoxLayout, QLabel, QWidget, QCheckBox
from PySide6.QtCore import QSettings


class LLMWarningDialog(QDialog):
    """
    This dialog informs users that the AI feature operates entirely on their laptop,
    ensuring that data from their table is never sent or shared outside the device.
    """

    def __init__(self, parent: QWidget):
        super().__init__(parent)
        self.setWindowTitle(self.tr("AI feature"))
        # TODO: dialog size is not set properly when having the application in a second monitor
        # so we force it to a minimun.
        self.setMinimumSize(500, 200)

        layout = QVBoxLayout()

        self.warning_text = QLabel()
        self.warning_text.setWordWrap(True)
        self.warning_text.setText(
            self.tr(
                "Welcome to the ODE's AI assistant! This feature will help you generating better descriptions for the columns of your table and also questions for data analysis. To get started, you will need to install the AI file in your computer. Once installed, everything will run locally, meaning your data always stays private and secure. Learn more"
            )
        )

        self.dont_show_again_checkbox = QCheckBox()
        self.dont_show_again_checkbox.setText(self.tr("Don't show this dialog again"))

        button_layout = QHBoxLayout()
        self.cancel_button = QPushButton()
        self.cancel_button.clicked.connect(self.reject)
        self.cancel_button.setText(self.tr("Cancel"))
        button_layout.addWidget(self.cancel_button)

        self.ok_button = QPushButton()
        self.ok_button.setDefault(True)
        button_layout.addWidget(self.ok_button)
        self.ok_button.clicked.connect(self.accept)
        self.ok_button.setText(self.tr("Ok"))

        layout.addWidget(self.warning_text)
        layout.addWidget(self.dont_show_again_checkbox)
        layout.addLayout(button_layout)
        self.setLayout(layout)

    def accept(self):
        """Override accept to save the checkbox state"""
        if self.dont_show_again_checkbox.isChecked():
            settings = QSettings()
            settings.setValue("llm_warning_dialog/dont_show_again", True)

        super().accept()

    @staticmethod
    def confirm(parent):
        settings = QSettings()
        # Check if the user has previously chosen to not show the dialog again
        if settings.value("llm_warning_dialog/dont_show_again", False, type=bool):
            # For testing we remove it, but in production we just return True
            settings.remove("llm_warning_dialog/dont_show_again")
            return True

        dialog = LLMWarningDialog(parent)
        return dialog.exec() == QDialog.Accepted
