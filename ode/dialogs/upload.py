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


class SelectWidget(QWidget):
    """Widget to render the File/Folder upload buttons."""
    def __init__(self, icon_path, text, parent=None):
        super().__init__(parent)
        layout = QVBoxLayout()

        icon_label = QLabel(self)
        pixmap = QPixmap(icon_path)
        icon_label.setPixmap(pixmap)
        icon_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(icon_label)

        text_label = QLabel(text)
        text_label.setAlignment(Qt.AlignCenter)
        text_label.setWordWrap(True)
        layout.addWidget(text_label)

        self.select_button = QPushButton("Select")
        layout.addWidget(self.select_button)

        self.setLayout(layout)

    def connect_select_action(self, action):
        self.select_button.clicked.connect(action)


class DataImportDialog(QDialog):
    """Dialog to Upload File, Folders or URLs.

    The goal of this Dialog is to have an intuitive UX for people to add
    files, folders or URLs. For external URLs we rely on frictionless-py
    TableResource method to read and write CSV hosted in the web and Google
    Spreadsheets.
    """

    def __init__(self, parent):
        super().__init__(parent)
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
        from_computer_tab.setLayout(from_computer_layout)

        file_select_widget = SelectWidget(
            Paths.asset("icons/upload-file.png"), "Add one or more Excel or csv files"
        )
        file_select_widget.connect_select_action(self.add_files)
        folder_select_widget = SelectWidget(
            Paths.asset("icons/upload-folder.png"), "Add one or more folders"
        )
        folder_select_widget.connect_select_action(self.add_folders)

        from_computer_layout.addWidget(file_select_widget)
        from_computer_layout.addWidget(folder_select_widget)

        # Add External Data Tab
        external_data_tab = QWidget()
        external_data_layout = QVBoxLayout()
        external_data_tab.setLayout(external_data_layout)

        url_label = QLabel("Link to the external table: ")
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("Enter or paste URL")
        help_text = QLabel("Here you can paste links from public Google Sheets and urls from csv files in open data portals and GitHub.")
        help_text.setWordWrap(True)
        help_text.setStyleSheet("font-style:italic; font-size: 15px;")
        paste_button = QPushButton("Add")
        paste_button.clicked.connect(self.load_table_from_url)
        self.error_text = QLabel()
        self.error_text.setWordWrap(True)
        self.error_text.setStyleSheet("color: red; font-style: italic; font-size: 15px;")

        external_data_layout.addWidget(url_label)
        external_data_layout.addWidget(self.url_input)
        external_data_layout.addWidget(help_text)
        external_data_layout.addWidget(paste_button)
        external_data_layout.addWidget(self.error_text)

        # Add Tabs to Tab Widget
        tab_widget.addTab(from_computer_tab, "From Your Computer")
        tab_widget.addTab(external_data_tab, "Add External Data")

        self.setLayout(main_layout)

    def add_files(self):
        """Copy the selected file to the project path."""
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
        """Copy the selected folder and all its content to the project path."""
        source_folder = QFileDialog.getExistingDirectory(self, "Select Folder")
        if source_folder:
            folder_name = os.path.basename(source_folder)
            target_folder = os.path.join(Paths.PROJECT_PATH, folder_name)
            shutil.copytree(source_folder, target_folder, dirs_exist_ok=True)
        self.close()

    def load_table_from_url(self):
        """Load a tabular file from a public URL.

        This method uses frictionless to read a remote URL. Currently we support
        Google Spreadsheets and any other URL pointing to a csv file.
        """
        url = self.url_input.text()
        if not url:
            self.error_text.setText("Please paste a valid URL.")
            return
        if not url.startswith(("http://", "https://")):
            self.error_text.setText("Please paste a valid URL starting with http:// or https://.")
            return

        table = TableResource(path=url)
        filename = table.name
        if table.format == "gsheets":
            filename = self._read_url_html_title(url)
        file_path = os.path.join(Paths.PROJECT_PATH, filename + '.csv')

        try:
            with open(file_path, mode='w') as file:
                table.write(file.name)
            self.url_input.setText("")
            self.error_text.setText("")
            self.close()
        except Exception as e:
            error = f"An error occurred: {e}"
            self.error_text.setText(error)

    def _read_url_html_title(self, url):
        """ Return the title of HTML document.

        We use the `title` attribute of the Google Spreadshet's HTML as name of the file.
        This attribute is the same as the name of the spreadsheet.
        """
        file = FileResource(path=url)
        text = file.read_text(size=10000)
        match = re.search(r"<title>(.*?)</title>", text)
        if match:
            title = match.group(1)
            title = title.rsplit("- Google", 1)[0].strip()
            return f"{title}"
        return "google-sheets"


if __name__ == "__main__":
    app = QApplication(sys.argv)
    dialog = DataImportDialog()
    dialog.exec()
    sys.exit(app.exec())
