from PySide6.QtWidgets import QDialog, QVBoxLayout, QPushButton, QHBoxLayout, QLabel, QWidget


class DeleteDialog(QDialog):
    """
    Dialog to delete a file.
    """

    def __init__(self, parent: QWidget, filename: str):
        super().__init__(parent)

        self.result_text = None
        layout = QVBoxLayout()

        self.delete_dialog_label = QLabel()
        layout.addWidget(self.delete_dialog_label)

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
    def confirm(parent, filename):
        """Static method that returns a boolean value indicating if the user
        confirmed the deletion of the file."""
        dialog = DeleteDialog(parent, filename)
        return dialog.exec() == QDialog.Accepted

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.cancel_button.setText(self.tr("Cancel"))
        self.ok_button.setText(self.tr("Ok"))
        self.delete_dialog_label.setText(self.tr("Are you sure you want to delete this item?"))
        self.setWindowTitle(self.tr("Delete file"))
