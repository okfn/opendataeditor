from PySide6.QtWidgets import QDialog, QVBoxLayout, QHBoxLayout, QPushButton, QWidget, QGridLayout, QLabel, QLineEdit
from PySide6.QtCore import Qt


class ContributorDetailForm(QWidget):
    """
    Widget to show the details of a contributor that will be displayed inside a dialog.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        layout = QGridLayout()

        self.titleLabel = QLabel()
        layout.addWidget(self.titleLabel, 0, 0)
        self.title = QLineEdit()
        self.title.setMinimumWidth(200)
        layout.addWidget(self.title, 0, 1)

        self.emailLabel = QLabel()
        layout.addWidget(self.emailLabel, 1, 0)
        self.email = QLineEdit()
        self.email.setMinimumWidth(200)
        layout.addWidget(self.email, 1, 1)

        self.roleLabel = QLabel()
        layout.addWidget(self.roleLabel, 0, 2)
        self.role = QLineEdit()
        self.role.setMinimumWidth(200)
        layout.addWidget(self.role, 0, 3)

        self.pathLabel = QLabel()
        layout.addWidget(self.pathLabel, 1, 2)
        self.path = QLineEdit()
        self.path.setMinimumWidth(200)
        layout.addWidget(self.path, 1, 3)

        layout.setColumnMinimumWidth(1, 150)
        layout.setColumnMinimumWidth(3, 150)
        layout.setHorizontalSpacing(20)

        self.setLayout(layout)
        self.retranslateUI()

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.titleLabel.setText(self.tr("Title:"))
        self.roleLabel.setText(self.tr("Role:"))
        self.emailLabel.setText(self.tr("Email:"))
        self.pathLabel.setText(self.tr("Path:"))


class ContributorDialog(QDialog):
    """
    Dialog for adding or editing a contributor.
    """

    def __init__(self, parent: QWidget, contributor: dict, contributor_pos: int = 0):
        """
        Initialize the dialog.

        Args:
            parent: The parent widget
            contributor: The contributor data dictionary
            contributor_pos: The position of the contributor in the list (None for new contributors)
        """
        super().__init__(parent)
        self.parent = parent
        self.contributor = contributor
        self.contributor_pos = contributor_pos
        self.result_saved = False

        # Set up the form
        self.form = ContributorDetailForm()
        self.form.title.setText(contributor.get("title", ""))
        self.form.role.setText(contributor.get("role", ""))
        self.form.email.setText(contributor.get("email", ""))
        self.form.path.setText(contributor.get("path", ""))

        # Set window modality
        self.setWindowModality(Qt.WindowModal)

        # Create buttons
        self.save_button = QPushButton()
        self.cancel_button = QPushButton()

        # Set up the layout
        self.setup_layout()

        # Connect signals
        self.save_button.clicked.connect(self.save_and_close)
        self.cancel_button.clicked.connect(self.reject)

    def setup_layout(self):
        """
        Set up the dialog layout.
        """
        layout = QVBoxLayout()
        layout.addWidget(self.form)

        # Buttons layout
        buttons_layout = QHBoxLayout()
        buttons_layout.addWidget(self.cancel_button)
        buttons_layout.addWidget(self.save_button)
        layout.addLayout(buttons_layout)

        self.setLayout(layout)
        self.retranslateUI()

    def save_and_close(self):
        """
        Save the contributor data and close the dialog.
        """
        # Update the contributor dictionary with form data
        self.contributor.update(
            {
                "title": self.form.title.text(),
                "email": self.form.email.text(),
                "role": self.form.role.text(),
                "path": self.form.path.text(),
            }
        )

        # Add or update the contributor in the parent widget
        if self.contributor_pos is None:
            contributor_pos = self.parent.contributors_list.count()
            self.parent.add_contributor(self.contributor, contributor_pos)
        else:
            self.parent.update_contributor(self.contributor, self.contributor_pos)

        self.result_saved = True
        self.accept()

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.save_button.setText(self.tr("Save"))
        self.cancel_button.setText(self.tr("Cancel"))
