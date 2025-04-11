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

        self.result_text = None

        layout = QVBoxLayout()
        self.rename_label = QLabel()
        layout.addWidget(self.rename_label)

        self.text_edit = QLineEdit(filename)
        self.text_edit.setMinimumWidth(300)
        self.text_edit.setMinimumHeight(30)
        layout.addWidget(self.text_edit)

        button_layout = QHBoxLayout()
        self.cancel_button = QPushButton()
        self.ok_button = QPushButton()
        # We set the default button to OK when clicking Enter
        self.ok_button.setDefault(True)

        self.cancel_button.clicked.connect(self.reject)
        self.ok_button.clicked.connect(self.accept)

        button_layout.addWidget(self.cancel_button)
        button_layout.addWidget(self.ok_button)

        layout.addLayout(button_layout)
        self.setLayout(layout)
        self.retranslateUI()

    def accept(self):
        """
        Accept the dialog and save the new filename in result_text."""
        self.result_text = self.text_edit.text()
        super().accept()

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.setWindowTitle(self.tr("Rename file"))
        self.rename_label.setText(self.tr("Rename item to:"))
        self.cancel_button.setText(self.tr("Cancel"))
        self.ok_button.setText(self.tr("OK"))
