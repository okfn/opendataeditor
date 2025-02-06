import sys
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPlainTextEdit, QLabel
from PySide6.QtGui import QFont
from PySide6.QtCore import Qt, QFileInfo


class SourceViewer(QWidget):
    """Widget to display files as they are (raw).

    For now it only displays CSV files but it can be easily modify to also show
    other types of non-binary data like TSV, JSON, etc.
    """
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        self.setLayout(layout)

        self.label = QLabel()
        self.label.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignTop)

        self.text_edit = QPlainTextEdit(self)
        self.text_edit.setLineWrapMode(QPlainTextEdit.NoWrap)
        self.text_edit.setReadOnly(True)
        self.text_edit.setFont(QFont("Courier"))
        self.text_edit.hide()

        layout.addWidget(self.label)
        layout.addWidget(self.text_edit)

    def open_csv_file(self, filepath):
        info = QFileInfo(filepath)
        if not info.isFile() or not info.suffix() in ['csv']:
            self.label.show()
            self.text_edit.hide()
            return

        with open(filepath, 'r') as file:
            csv_content = file.read()
            self.label.hide()
            self.text_edit.show()
            self.text_edit.setPlainText(csv_content)

    def retranslateUI(self):
        self.label.setText(self.tr("Source view not available for this file."))


if __name__ == "__main__":
    app = QApplication(sys.argv)

    viewer = SourceViewer()
    viewer.show()

    sys.exit(app.exec())
