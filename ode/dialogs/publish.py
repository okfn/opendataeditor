from frictionless import Package, system
from frictionless.portals.github.control import GithubControl
from PySide6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QFormLayout,
    QPushButton,
    QLabel,
    QDialog,
    QTabWidget,
    QLineEdit,
)
from PySide6.QtGui import QPixmap
from PySide6.QtCore import Qt
from pathlib import Path

from ode.paths import Paths, PROJECT_PATH
from ode.file import File


class GithubWidget(QWidget):
    def __init__(self, filepath: Path) -> None:
        super().__init__()
        self.file = File(filepath)
        self.form_layout = QFormLayout()
        self.setLayout(self.form_layout)
        self.user_label = QLabel()
        self.user_input = QLineEdit()
        self.form_layout.addRow(self.user_label, self.user_input)
        self.repo_label = QLabel()
        self.repo_input = QLineEdit()
        self.form_layout.addRow(self.repo_label, self.repo_input)
        self.email_label = QLabel()
        self.email_input = QLineEdit()
        self.form_layout.addRow(self.email_label, self.email_input)
        self.api_key_label = QLabel()
        self.api_key_input = QLineEdit()
        self.api_key_input.setEchoMode(QLineEdit.EchoMode.Password)
        self.form_layout.addRow(self.api_key_label, self.api_key_input)
        self.publish_button = QPushButton()
        self.publish_button.clicked.connect(self.publish)
        self.form_layout.addWidget(self.publish_button)
        self.error_label = QLabel()
        self.error_label.setWordWrap(True)
        self.error_label.setStyleSheet("font-size: 14px; color: red;")
        self.form_layout.addWidget(self.error_label)

        self.retranslateUI()

    def publish(self) -> None:
        apikey = self.api_key_input.text()
        email = self.email_input.text()
        repo = self.repo_input.text()
        user = self.user_input.text()
        if not apikey or not email or not repo or not user:
            self.error_label.setText(self.tr("All fields are mandatory."))
            return
        resource = self.file.get_or_create_metadata().get("resource")
        # Published path should be relative to the project and not an absolute path of the user machine.
        resource.path = str(self.file.path.relative_to(PROJECT_PATH))
        package = Package(resources=[resource], basepath=str(PROJECT_PATH))
        control = GithubControl(apikey=apikey, email=email, repo=repo, user=user)
        self.window().update_status_bar(self.tr("Publishing data to Github..."))
        try:
            with system.use_context(trusted=True):
                package.publish(control=control)
            self.window().update_status_bar(self.tr("Publish to Github complete."))
            self.window().close()
        except Exception as e:
            self.error_label.setText(str(e))

    def retranslateUI(self) -> None:
        """Apply translations to class elements."""
        self.user_label.setText(self.tr("User:"))
        self.repo_label.setText(self.tr("Repository: "))
        self.email_label.setText(self.tr("Email: "))
        self.api_key_label.setText(self.tr("API Key: "))
        self.publish_button.setText(self.tr("Publish"))


class PublishDialog(QDialog):
    """Dialog to Publish the file and metadata to third party services."""

    def __init__(self, parent, filepath: Path) -> None:
        super().__init__(parent)
        self.setFixedWidth(750)

        main_layout = QVBoxLayout()

        # Block the main window until the dialog is closed
        self.setWindowModality(Qt.ApplicationModal)

        # Centered Image
        image_label = QLabel(self)
        image_label.setFixedHeight(200)
        pixmap = QPixmap(Paths.asset("images/dialog_publish.png"))
        image_label.setPixmap(pixmap)
        image_label.setAlignment(Qt.AlignCenter)
        main_layout.addWidget(image_label)

        # Tab Widget
        self.tab_widget = QTabWidget()
        main_layout.addWidget(self.tab_widget)

        self.github = GithubWidget(filepath=filepath)
        self.ckan = QLabel()
        self.ckan.setOpenExternalLinks(True)
        self.ckan.setWordWrap(True)
        self.zenodo = QLabel()
        self.zenodo.setOpenExternalLinks(True)
        self.zenodo.setWordWrap(True)

        # Add Tabs to Tab Widget
        self.tab_widget.addTab(self.github, "Github")
        self.tab_widget.addTab(self.ckan, "CKAN")
        self.tab_widget.addTab(self.zenodo, "Zenodo")

        self.setLayout(main_layout)

        self.retranslateUI()

    def update_status_bar(self, text: str) -> None:
        """Update the application Main Windows status bar.

        The PublishDialog becomes a window so children widgets only have access to the MainWindow
        through the parent of this Dialog.
        """
        self.parent().statusBar().showMessage(text)

    def retranslateUI(self) -> None:
        """Apply translations to class elements."""
        self.setWindowTitle(self.tr("Publish dataset"))
        text = self.tr("This Publishing feature is comming soon...<br>Are you interested? Contact us at <a href='mailto:info@okfn.org'>info@okfn.org</a>.")
        self.ckan.setText(text)
        self.zenodo.setText(text)

