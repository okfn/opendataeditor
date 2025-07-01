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
    QSpinBox,
)
from PySide6.QtCore import Qt, Signal


class DataTypeMapper:
    """Class to handle bidirectional mapping between internal types and user-displayed types"""

    DATA_TYPES = [
        "number",
        "date",
        "string",
        "any",
        "array",
        "boolean",
        "datetime",
        "duration",
        "geojson",
        "geopoint",
        "integer",
        "object",
        "time",
        "year",
        "yearmonth",
    ]

    # Mapping from internal types to user-displayed types
    DISPLAY_MAPPING = {
        "string": "Text",
        "number": "Number",
        "date": "Date",
        "any": "Any",
        "array": "Array",
        "boolean": "Boolean",
        "datetime": "Date Time",
        "duration": "Duration",
        "geojson": "GeoJSON",
        "geopoint": "Geo Point",
        "integer": "Integer",
        "object": "Object",
        "time": "Time",
        "year": "Year",
        "yearmonth": "Year Month",
    }

    def __init__(self):
        # Reverse mapping: from displayed types to internal types
        self.internal_mapping = {v: k for k, v in self.DISPLAY_MAPPING.items()}

    def get_display_type(self, internal_type):
        """Converts an internal type to its user-displayed representation"""
        return self.DISPLAY_MAPPING.get(internal_type, internal_type)

    def get_internal_type(self, display_type):
        """Converts a user-displayed type to its internal representation"""
        return self.internal_mapping.get(display_type, display_type)

    def get_all_display_types(self):
        """Returns all types in user-display format"""
        return [self.get_display_type(t) for t in self.DATA_TYPES]

    def get_all_internal_types(self):
        """Returns all internal types"""
        return self.DATA_TYPES.copy()


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
    Widget to show the Metadata Fields that will be displayed inside a dialog.
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
        layout.addWidget(self.type, 1, 1, 1, 3)
        self.type.currentTextChanged.connect(self.on_type_changed)

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
        self.required.addItems(["Yes", "No"])
        layout.addWidget(self.required, 3, 1, 1, 3)

        # Min and Max Length
        self.min_length_label = QLabel()
        layout.addWidget(self.min_length_label, 4, 0)
        self.min_length = QSpinBox()
        layout.addWidget(self.min_length, 4, 1)

        self.max_length_label = QLabel()
        layout.addWidget(self.max_length_label, 4, 2)
        self.max_length = QSpinBox()
        layout.addWidget(self.max_length, 4, 3)

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

    def on_type_changed(self, text):
        """
        Updates the min and max length fields based on the selected type.
        """
        if text == "Text":
            self.min_length.setEnabled(True)
            self.min_length.setStyleSheet("")
            self.min_length_label.setStyleSheet("")

            self.max_length.setEnabled(True)
            self.max_length.setStyleSheet("")
            self.max_length_label.setStyleSheet("")
        else:
            self.min_length.setEnabled(False)
            self.min_length.setStyleSheet("color: lightgray;")
            self.min_length_label.setStyleSheet("color: lightgray;")

            self.max_length.setEnabled(False)
            self.max_length.setStyleSheet("color: lightgray;")
            self.max_length_label.setStyleSheet("color: lightgray;")

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.nameLabel.setText(self.tr("Column Name:"))
        self.typeLabel.setText(self.tr("Data Type:"))
        self.description_label.setText(self.tr("Description:"))
        self.required_label.setText(self.tr("Flag empty cells as errors?:"))
        self.min_length_label.setText(self.tr("Min. Characters in cells:"))
        self.max_length_label.setText(self.tr("Max. Characters in cell"))


class ColumnMetadataDialog(QDialog):
    """
    Dialog for editing the column's metadata.
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

        self.dataTypeMapper = DataTypeMapper()

        self.field_index = field_index
        self.field_names = field_names
        self.field = field

        # Set up the form
        self.form = MetadataForm()
        self.form.name.setText(field.name)
        self.form.type.addItems(self.dataTypeMapper.get_all_display_types())
        self.form.type.setCurrentText(self.dataTypeMapper.get_display_type(field.type))
        self.form.description.setText(field.description)
        self.form.required.setCurrentText("Yes" if field.constraints.get("required") else "No")

        self.form.min_length.setMinimum(0)
        self.form.min_length.setMaximum(999999)
        self.form.min_length.setValue(field.constraints.get("minLength", 0))

        self.form.max_length.setMinimum(0)
        self.form.max_length.setMaximum(999999)
        self.form.max_length.setValue(field.constraints.get("maxLength", 100))

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
        errors = []

        # Validate the field name
        field_name = self.form.name.text()
        if field_name != self.field.name:
            if field_name.strip() == "" or field_name in self.field_names:
                # If the name is already used, show an error
                self.form.name.setStyleSheet("border: 1px solid red;")
                if field_name.strip() == "":
                    self.form.error_label.setText(self.tr("Column name cannot be empty"))
                else:
                    errors.append(
                        self.tr(
                            "There is another column in the table with the same name. Please choose a different one"
                        )
                    )

        if errors:
            self.form.error_label.setText("\n".join(errors))
            self.form.error_label.setHidden(False)
            return

        self.save_clicked.emit(
            {
                "index": self.field_index,
                "name": field_name,
                "type": self.dataTypeMapper.get_internal_type(self.form.type.currentText()),
                "description": self.form.description.toPlainText(),
                "constraints": {
                    "required": self.form.required.currentText() == "Yes",
                    "minLength": self.form.min_length.value(),
                    "maxLength": self.form.max_length.value(),
                },
            }
        )
        self.accept()

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.save_button.setText(self.tr("Save"))
        self.cancel_button.setText(self.tr("Cancel"))
