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
    def __init__(self, filepath: Path):
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
        self.form_layout.addWidget(self.error_label)

        self.retranslateUI()

    def publish(self):
        resource = self.file.get_or_create_metadata().get("resource")
        resource.path = str(self.file.path.relative_to(PROJECT_PATH))
        package = Package(resources=[resource], basepath=str(PROJECT_PATH))
        control = GithubControl(
            apikey=self.api_key_input.text(),
            email=self.email_input.text(),
            repo=self.repo_input.text(),
            user=self.user_input.text(),
        )
        try:
            with system.use_context(trusted=True):
                result = package.publish(control=control)
            self.error_label.setText(f"Repository successfuly created at <a href='{result.url}'>{result.url}</a>.")
        except Exception as e:
            self.error_label.setText(str(e))

    def retranslateUI(self):
        self.user_label.setText(self.tr("User:"))
        self.repo_label.setText(self.tr("Repository: "))
        self.email_label.setText(self.tr("Email: "))
        self.api_key_label.setText(self.tr("API Key: "))
        self.publish_button.setText(self.tr("Publish"))


class PublishDialog(QDialog):
    """Dialog to Publish the file and metadata to third party services."""

    def __init__(self, parent, filepath: Path):
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

        # Add Tabs to Tab Widget
        self.tab_widget.addTab(self.github, "")

        self.setLayout(main_layout)

        self.retranslateUI()

    def retranslateUI(self):
        """Apply translations to class elements."""
        self.setWindowTitle(self.tr("Publish dataset"))
        self.tab_widget.setTabText(0, self.tr("Github"))
