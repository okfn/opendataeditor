from PySide6.QtWidgets import QDialog, QVBoxLayout, QPushButton, QHBoxLayout, QLabel, QWidget


class DeleteDialog(QDialog):
    """
    Dialog to delete a file.
    """

    def __init__(self, parent: QWidget, filename: str):
        super().__init__(parent)

        self.setWindowTitle("Delete file")
        self.result_text = None

        layout = QVBoxLayout()

        layout.addWidget(
            QLabel(
                self.tr(f"Are you sure you want to delete this file {filename}?"),
            )
        )

        button_layout = QHBoxLayout()
        cancel_button = QPushButton("Cancel")
        # We set the default button to Cancel when clicking Enter
        cancel_button.setDefault(True)
        ok_button = QPushButton("OK")

        cancel_button.clicked.connect(self.reject)
        ok_button.clicked.connect(self.accept)

        button_layout.addWidget(cancel_button)
        button_layout.addWidget(ok_button)

        layout.addLayout(button_layout)
        self.setLayout(layout)

    @staticmethod
    def confirm(parent, filename):
        """Static method that returns a boolean value indicating if the user
        confirmed the deletion of the file."""
        dialog = DeleteDialog(parent, filename)
        return dialog.exec() == QDialog.Accepted
