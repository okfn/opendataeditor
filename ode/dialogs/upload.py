import os
import re
import sys
import shutil

from frictionless.resources import FileResource, TableResource

from PySide6.QtWidgets import (
        QApplication, QWidget, QVBoxLayout, QHBoxLayout, QPushButton,
        QLabel, QFileDialog, QDialog, QTabWidget, QLineEdit
)
from PySide6.QtGui import QPixmap
from PySide6.QtCore import Qt

from ode.paths import Paths


class FileSelectWidget(QWidget):
    def __init__(self, icon_path, text, parent=None):
        super().__init__(parent)
        self.initUI(icon_path, text)

    def initUI(self, icon_path, text):
        layout = QVBoxLayout()

        # Icon
        icon_label = QLabel(self)
        pixmap = QPixmap(icon_path)
        icon_label.setPixmap(pixmap)
        icon_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(icon_label)

        # Text
        text_label = QLabel(text)
        text_label.setAlignment(Qt.AlignCenter)
        text_label.setWordWrap(True)
        layout.addWidget(text_label)

        # Select Button
        self.select_button = QPushButton("Select")
        layout.addWidget(self.select_button)

        self.setLayout(layout)

    def connect_select_action(self, action):
        self.select_button.clicked.connect(action)


class DataImportDialog(QDialog):
    def __init__(self, parent):
        super().__init__(parent)
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Import Data")
        self.setFixedHeight(500)
        self.setFixedWidth(500)

        main_layout = QVBoxLayout()

        # Centered Image
        image_label = QLabel(self)
        image_label.setFixedHeight(200)
        pixmap = QPixmap(Paths.asset("images/dialog_upload_files.png"))
        image_label.setPixmap(pixmap)
        image_label.setAlignment(Qt.AlignCenter)
        main_layout.addWidget(image_label)

        # Tab Widget
        tab_widget = QTabWidget()
        main_layout.addWidget(tab_widget)

        # From Your Computer Tab
        from_computer_tab = QWidget()
        from_computer_layout = QHBoxLayout()

        # File Select Widget for Excel/CSV Files
        file_select_widget = FileSelectWidget(
            Paths.asset("icons/upload-file.png"), "Add one or more Excel or csv files"
        )
        file_select_widget.connect_select_action(self.add_files)
        from_computer_layout.addWidget(file_select_widget)

        # File Select Widget for Folders
        folder_select_widget = FileSelectWidget(
            Paths.asset("icons/upload-folder.png"), "Add one or more folders"
        )
        folder_select_widget.connect_select_action(self.add_folders)
        from_computer_layout.addWidget(folder_select_widget)

        from_computer_tab.setLayout(from_computer_layout)

        # Add External Data Tab
        external_data_tab = QWidget()
        external_data_layout = QVBoxLayout()

        google_spreadsheet_label = QLabel("Paste Google Spreadsheet URL:")
        external_data_layout.addWidget(google_spreadsheet_label)

        self.google_spreadsheet_input = QLineEdit()
        external_data_layout.addWidget(self.google_spreadsheet_input)

        paste_button = QPushButton("Paste and Load")
        paste_button.clicked.connect(self.load_google_spreadsheet)
        external_data_layout.addWidget(paste_button)

        external_data_tab.setLayout(external_data_layout)

        # Add Tabs to Tab Widget
        tab_widget.addTab(from_computer_tab, "From Your Computer")
        tab_widget.addTab(external_data_tab, "Add External Data")

        self.setLayout(main_layout)

    def add_files(self):
        filters = [
                "All supported files (*.csv *.xlsx *.xls)",
                "Comma Separated Values (*.csv)",
                "Excel 2007-365 (*.xlsx)",
                "Excel 97-2003 (*.xls)",
        ]
        filename, _ = QFileDialog.getOpenFileName(self, "Open file", filter=";;".join(filters))

        if not filename:
            return
        shutil.copy(filename, Paths.PROJECT_PATH)
        self.close()

    def add_folders(self):
        source_folder = QFileDialog.getExistingDirectory(self, "Select Folder")
        if source_folder:
            folder_name = os.path.basename(source_folder)
            target_folder = os.path.join(Paths.PROJECT_PATH, folder_name)
            shutil.copytree(source_folder, target_folder, dirs_exist_ok=True)
        self.close()

    def load_google_spreadsheet(self):
        url = self.google_spreadsheet_input.text()
        if url:
            try:
                table = TableResource(path=url)
                filename = self._read_google_sheets_title(url)
                csv_filename = os.path.join(Paths.PROJECT_PATH, filename + ".csv")
                with open(csv_filename, mode='w') as file:
                    table.write(file.name)
                print(f"Spreadsheet data successfully written to {csv_filename}")
                self.close()
            except Exception as e:
                print(f"An error occurred: {e}")
        else:
            print("Please paste a valid Google Spreadsheet URL.")

    def _read_google_sheets_title(self, url):
        """ Return the name of the spreadsheet.

        We use public HTML to extract the title of the document, else we set
        the name of the file as `google-sheets.csv`.
        """
        file = FileResource(path=url)
        text = file.read_text(size=10000)
        match = re.search(r"<title>(.*?)</title>", text)
        if match:
            title = match.group(1)
            title = title.rsplit("- Google", 1)[0].strip()
            return f"{title}.csv"
        return "google-sheets.csv"


if __name__ == "__main__":
    app = QApplication(sys.argv)
    dialog = DataImportDialog()
    dialog.exec()
    sys.exit(app.exec())
