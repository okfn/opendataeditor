import os
import shutil

from PySide6.QtWidgets import QVBoxLayout, QPushButton, QDialog, QMessageBox, QFileDialog, QLabel
from PySide6.QtCore import Qt
from pathlib import Path


class DownloadDialog(QDialog):
    """Dialog to Publish the file and metadata to third party services."""

    def __init__(self, parent, filepath: Path) -> None:
        super().__init__(parent)

        self.filepath = filepath
        self.setFixedHeight(200)

        layout = QVBoxLayout()

        self.label = QLabel()
        layout.addWidget(self.label)

        # Block the main window until the dialog is closed
        self.setWindowModality(Qt.ApplicationModal)

        self.download_button = QPushButton()
        self.download_button.clicked.connect(self.download_file)
        layout.addWidget(self.download_button)

        self.setLayout(layout)
        self.retranslateUI()

    def retranslateUI(self) -> None:
        """Apply translations to class elements."""
        self.label.setText(self.tr("Download the file to your local machine."))
        self.setWindowTitle(self.tr("Download dataset"))
        self.download_button.setText(self.tr("Download file"))

    def download_file(self):
        """
        Opens a dialog to select the destination directory and copies the file
        """
        download_directory = QFileDialog.getExistingDirectory(
            self,
            self.tr("Select Destination Directory"),
            "",
            QFileDialog.ShowDirsOnly | QFileDialog.DontResolveSymlinks,
        )

        if not download_directory:
            return

        try:
            filename = os.path.basename(self.selected_file_path)
            download_filepath = os.path.join(download_directory, filename)
            shutil.copy2(self.filepath, download_filepath)

            success_text = self.tr("File copied successfully to:\n{}").format(download_filepath)
            QMessageBox.information(self, self.tr("Success"), success_text)

        except Exception as e:
            error_text = self.tr("Error copying file:\n{}").format(str(e))
            QMessageBox.critical(self, "Error", error_text)
