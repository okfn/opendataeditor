from PySide6.QtWidgets import QDialog, QVBoxLayout, QPushButton, QHBoxLayout, QLabel, QWidget


class LLMWarningDialog(QDialog):
    """
    This dialog informs users that the AI feature operates entirely on their laptop,
    ensuring that data from their table is never sent or shared outside the device.
    """

    def __init__(self, parent: QWidget):
        super().__init__(parent)

        self.result_text = None
        self.setFixedSize(600, 120)

        layout = QVBoxLayout()
        self.setWindowTitle(self.tr("AI feature"))

        self.warning_text = QLabel()
        self.warning_text.setWordWrap(True)
        layout.addWidget(self.warning_text)
        self.warning_text.setText(
            self.tr(
                "The AI integration operates entirely on your laptop. This means that when using this feature the data from your table is never sent or shared outside this device."
            )
        )

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

        layout.addLayout(button_layout)
        self.setLayout(layout)

    @staticmethod
    def confirm(parent):
        dialog = LLMWarningDialog(parent)
        return dialog.exec() == QDialog.Accepted
