from PySide6.QtWidgets import QDialog, QVBoxLayout, QLineEdit, QPushButton, QHBoxLayout, QLabel, QWidget


class RenameDialog(QDialog):
    """
    Dialog to rename a file.
    The dialog will show a text box with the current filename and allow the user
    to change it. The dialog will save the new filaneme in the result_text
    attribute when the user clicks OK.
    """

    def __init__(self, parent: QWidget, filename: str):
        super().__init__(parent)

        self.setWindowTitle("Rename file")
        self.result_text = None

        layout = QVBoxLayout()
        layout.addWidget(QLabel("Rename item to:"))

        self.text_edit = QLineEdit(filename)
        self.text_edit.setMinimumWidth(300)
        self.text_edit.setMinimumHeight(30)
        layout.addWidget(self.text_edit)

        button_layout = QHBoxLayout()
        cancel_button = QPushButton("Cancel")
        ok_button = QPushButton("OK")
        # We set the default button to OK when clicking Enter
        ok_button.setDefault(True)

        cancel_button.clicked.connect(self.reject)
        ok_button.clicked.connect(self.accept)

        button_layout.addWidget(cancel_button)
        button_layout.addWidget(ok_button)

        layout.addLayout(button_layout)
        self.setLayout(layout)

    def accept(self):
        """
        Accept the dialog and save the new filename in result_text."""
        self.result_text = self.text_edit.text()
        super().accept()
