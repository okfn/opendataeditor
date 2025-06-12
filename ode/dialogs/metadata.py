from PySide6.QtWidgets import (
    QDialog,
    QVBoxLayout,
    QHBoxLayout,
    QPushButton,
    QWidget,
    QGridLayout,
    QLabel,
    QLineEdit,
    QTextEdit,
    QComboBox,
)
from PySide6.QtCore import Qt, Signal

DIALECT_SEPERATORS = [
    ("Comma (,)", ","),
    ("Semicolon (;)", ";"),
    ("Tab", "\t"),
    ("Pipe (|)", "|"),
    ("Space", " "),
]


class NoWheelComboBox(QComboBox):
    """QComboBox that disables the mouse wheel event.

    The current UX when scrolling through FieldsForms is not ideal since as soon as
    the mouse points a QComboBox the form stops scrolling and it starts changing the
    value of the QComboBox instead.
    """

    def wheelEvent(self, event):
        event.ignore()


class MetadataForm(QWidget):
    """
    Widget to show the details of a contributor that will be displayed inside a dialog.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        layout = QGridLayout()

        # Name
        self.nameLabel = QLabel()
        layout.addWidget(self.nameLabel, 0, 0)
        self.name = QLineEdit()
        self.name.setMinimumWidth(200)
        layout.addWidget(self.name, 0, 1, 1, 3)

        # Type
        self.typeLabel = QLabel()
        layout.addWidget(self.typeLabel, 1, 0)
        self.type = NoWheelComboBox()
        self.type.addItems(
            [
                "any",
                "array",
                "boolean",
                "date",
                "datetime",
                "duration",
                "geojson",
                "geopoint",
                "integer",
                "number",
                "string",
                "object",
                "time",
                "year",
                "yearmonth",
            ]
        )
        layout.addWidget(self.type, 1, 1, 1, 3)

        # Description
        self.description_label = QLabel()
        layout.addWidget(self.description_label, 2, 0)
        self.description = QTextEdit()
        self.description.setMaximumHeight(60)
        layout.addWidget(self.description, 2, 1, 1, 3)

        # Required
        self.required_label = QLabel()
        layout.addWidget(self.required_label, 3, 0)
        self.required = QComboBox()
        self.required.addItems(["Highlight", "Don't Highlight"])
        layout.addWidget(self.required, 3, 1, 1, 3)

        # Min and Max Length
        self.min_length_label = QLabel()
        layout.addWidget(self.min_length_label, 4, 0)
        self.min_length = QLineEdit()
        layout.addWidget(self.min_length, 4, 1)

        self.max_length_label = QLabel()
        layout.addWidget(self.max_length_label, 4, 2)
        self.max_length = QLineEdit()
        layout.addWidget(self.max_length, 4, 3)

        # Separator
        self.dialect_separator_label = QLabel()
        layout.addWidget(self.dialect_separator_label, 5, 0)
        self.dialect_separator = NoWheelComboBox()
        self.dialect_separator.addItems([self.tr(sep) for sep, _ in DIALECT_SEPERATORS])
        layout.addWidget(self.dialect_separator, 5, 1, 1, 3)

        # Error label
        self.error_label = QLabel()
        self.error_label.setStyleSheet("color: red;")
        layout.addWidget(self.error_label, 6, 0, 1, 4)
        self.error_label.setHidden(True)

        # Set layout properties
        layout.setColumnMinimumWidth(1, 150)
        layout.setColumnMinimumWidth(3, 150)
        layout.setHorizontalSpacing(20)

        self.setLayout(layout)
        self.retranslateUI()

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.nameLabel.setText(self.tr("Name:"))
        self.typeLabel.setText(self.tr("Type:"))
        self.description_label.setText(self.tr("Description:"))
        self.required_label.setText(self.tr("Empty Fields:"))
        self.min_length_label.setText(self.tr("Min. Character Limit:"))
        self.max_length_label.setText(self.tr("Max Character Limit:"))
        self.dialect_separator_label.setText(self.tr("Separator Type:"))


class MetadataDialog(QDialog):
    """
    Dialog for adding or editing a contributor.
    """

    save_clicked = Signal(object)

    def __init__(self, parent: QWidget, field: dict, field_index: int, field_names: list):
        """
        Initialize the dialog.

        Args:
            parent: The parent widget
        """
        super().__init__(parent)
        self.parent = parent

        self.field_index = field_index
        self.field_names = field_names
        self.field = field

        # Set up the form
        self.form = MetadataForm()
        self.form.name.setText(field.name)
        self.form.type.setCurrentText(field.type)
        self.form.description.setText(field.description)
        self.form.required.setCurrentText("Highlight" if field.constraints.get("required") else "Don't Highlight")
        self.form.min_length.setText(str(field.constraints.get("minLength", "")))
        self.form.max_length.setText(str(field.constraints.get("maxLength", "")))

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
        Emits the save_clicked signal with the form data and closes the dialog.
        """
        # Validate the field name
        field_name = self.form.name.text()
        if field_name != self.field.name:
            if field_name.strip() == "" or field_name in self.field_names:
                # If the name is already used, show an error
                self.form.name.setStyleSheet("border: 1px solid red;")
                self.form.error_label.setText(self.tr("The name is required and must be unique."))
                self.form.error_label.setHidden(False)
                return

        self.save_clicked.emit(
            {
                "index": self.field_index,
                "name": field_name,
                "type": self.form.type.currentText(),
                "description": self.form.description.toPlainText(),
                "constraints": {
                    "required": self.form.required.currentText() == "Highlight",
                    "minLength": int(self.form.min_length.text()) if self.form.min_length.text() else None,
                    "maxLength": int(self.form.max_length.text()) if self.form.max_length.text() else None,
                },
                "dialectSeparator": DIALECT_SEPERATORS[self.form.dialect_separator.currentIndex()][1],
            }
        )
        self.accept()

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.save_button.setText(self.tr("Save"))
        self.cancel_button.setText(self.tr("Cancel"))
