from PySide6.QtWidgets import QDialog, QVBoxLayout, QPushButton, QHBoxLayout, QLabel, QWidget

class CancelAIWorkerDialog(QDialog):
    """
    Dialog to confirm the cancel of the AI Worker.
    """

    def __init__(self, parent: QWidget):
        super().__init__(parent)

        self.result_text = None
        layout = QVBoxLayout()

        self.dialog_label = QLabel()
        layout.addWidget(self.dialog_label)

        button_layout = QHBoxLayout()
        self.cancel_button = QPushButton()
        # We set the default button to Cancel when clicking Enter
        self.cancel_button.setDefault(True)
        self.ok_button = QPushButton()

        self.cancel_button.clicked.connect(self.reject)
        self.ok_button.clicked.connect(self.accept)

        button_layout.addWidget(self.cancel_button)
        button_layout.addWidget(self.ok_button)

        layout.addLayout(button_layout)
        self.setLayout(layout)
        self.retranslateUI()

    @staticmethod
    def confirm(parent):
        """Static method that returns a boolean value indicating if the user
        confirmed the deletion of the file."""
        dialog = CancelAIWorkerDialog(parent=parent)
        return dialog.exec() == QDialog.Accepted

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.cancel_button.setText(self.tr("Cancel"))
        self.ok_button.setText(self.tr("Ok"))
        self.dialog_label.setText(self.tr("Changing dataset will cancel the AI worker.\nDo you want to proceed?"))
        self.setWindowTitle(self.tr("Cancel AI worker?"))
