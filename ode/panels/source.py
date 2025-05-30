import sys

from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPlainTextEdit, QLabel
from PySide6.QtGui import QFont
from PySide6.QtCore import Qt, QFileInfo

from ode import utils


class SourceViewer(QWidget):
    """Widget to display files as they are (raw).

    This class needs to properly detect the enconding of a file. For now
    UTF-8 and ISO-8859-1 will cover most of our scenarios but we will fail
    to display source of minority languages.
    """

    def __init__(self):
        super().__init__()

        utils.set_common_style(self)

        layout = QVBoxLayout()
        self.setLayout(layout)

        self.label = QLabel()
        self.label.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignTop)

        self.text_edit = QPlainTextEdit()
        self.text_edit.setLineWrapMode(QPlainTextEdit.NoWrap)
        self.text_edit.setReadOnly(True)
        self.text_edit.setFont(QFont("Courier, monospace"))
        self.text_edit.hide()

        layout.addWidget(self.label)
        layout.addWidget(self.text_edit)

    def _read_file(self, filepath):
        """Function to read the file from disk and return a string.

        We could implement a more fancy approach with chardet to detect the file encoding
        but early tests where not performat enough. We are brute-forcing the two most popular
        encodings in the web.
        """
        content = ""
        try:
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            return content
        except Exception as e:
            content = f"Error while reading the file with encoding UTF-8: {e}"

        try:
            with open(filepath, "r", encoding="iso-8859-1") as file:
                content = file.read()
            return content
        except Exception as e:
            content += f"\nError while reading the file with encoding ISO-8859-1: {e}"

        return content

    def open_file(self, filepath):
        """Reads the file and sets the QPlainText."""
        info = QFileInfo(filepath)
        if not info.isFile() or info.suffix().lower() not in ["csv"]:
            self.label.show()
            self.text_edit.hide()
            return

        content = self._read_file(filepath)

        self.label.hide()
        self.text_edit.show()
        self.text_edit.setPlainText(content)

    def clear(self):
        """Shows an empty view."""
        self.label.show()
        self.text_edit.hide()

    def retranslateUI(self):
        self.label.setText(self.tr("Source view not available for this file."))


if __name__ == "__main__":
    app = QApplication(sys.argv)

    viewer = SourceViewer()
    viewer.show()

    sys.exit(app.exec())
