import os
import shutil

from PySide6.QtWidgets import QVBoxLayout, QPushButton, QDialog, QMessageBox, QLabel, QHBoxLayout
from PySide6.QtCore import Qt, Signal, QStandardPaths
from pathlib import Path


class DownloadDialog(QDialog):
    """Dialog to export the file and the errors."""

    download_data_with_errors = Signal()
    finished = Signal()

    def __init__(self, parent, filepath: Path) -> None:
        super().__init__(parent)

        self.filepath = filepath
        self.setFixedHeight(200)

        layout = QVBoxLayout()

        self.label = QLabel()
        layout.addWidget(self.label)

        # Block the main window until the dialog is closed
        self.setWindowModality(Qt.ApplicationModal)

        button_layout = QHBoxLayout()

        self.download_button = QPushButton()
        self.download_button.clicked.connect(self.download_file)
        button_layout.addWidget(self.download_button)

        self.download_error_button = QPushButton()
        self.download_error_button.clicked.connect(self.download_error_file)
        button_layout.addWidget(self.download_error_button)

        layout.addLayout(button_layout)

        self.setLayout(layout)
        self.retranslateUI()

    def retranslateUI(self) -> None:
        """Apply translations to class elements."""
        self.setWindowTitle(self.tr("Download"))
        self.label.setText(self.tr("Please, select one of the following options:"))
        self.download_button.setText(self.tr("Download file"))
        self.download_error_button.setText(self.tr("Download errors file"))

    def download_file(self):
        """
        Opens a dialog to select the destination directory and copies the file
        """
        downloads_path = QStandardPaths.writableLocation(QStandardPaths.DownloadLocation)
        filename = os.path.basename(self.filepath)
        filepath = Path(downloads_path, filename)

        try:
            shutil.copy2(self.filepath, filepath)
            success_text = self.tr("File downloaded successfully to:\n{}").format(filepath)
            QMessageBox.information(self, self.tr("Success"), success_text)

        except Exception as e:
            error_text = self.tr("Error downloading file:\n{}").format(str(e))
            QMessageBox.critical(self, "Error", error_text)

    def download_error_file(self):
        self.download_data_with_errors.emit()
