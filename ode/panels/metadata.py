import json
import sys

from frictionless.resources import TableResource
from frictionless import system
from pathlib import Path
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QWidget,
    QLabel,
    QVBoxLayout,
    QHBoxLayout,
    QStackedLayout,
    QApplication,
    QPushButton,
    QSpinBox,
    QMessageBox,
    QScrollArea,
    QTreeWidget,
    QTreeWidgetItem,
    QListWidget,
    QListWidgetItem,
    QFormLayout,
    QLineEdit,
    QComboBox,
    QGridLayout,
    QSizePolicy,
    QGroupBox,
    QFrame,
)

from ode.dialogs.contributor_dialog import ContributorDialog
from ode.file import File
from ode.paths import Paths
from ode import utils

_RESOURCE_METADATA = {
    "Schema": ["Column names"],
    "Resource": ["Integrity", "Licenses", "Contributors", "Sources"],
    "Dialect": ["Csv"],
}


class NoWheelComboBox(QComboBox):
    """QComboBox that disables the mouse wheel event.

    The current UX when scrolling through FieldsForms is not ideal since as soon as
    the mouse points a QComboBox the form stops scrolling and it starts changing the
    value of the QComboBox instead.
    """

    def wheelEvent(self, event):
        event.ignore()


class LicensesForm(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        self.licenses = self.get_list_of_licenses()
        # License selection
        self.license_list = QComboBox()
        self.license_list.addItems([lic["title"] for lic in self.licenses])
        layout.addWidget(QLabel("Available Licenses:"))
        layout.addWidget(self.license_list)

        # Buttons to add/remove licenses
        button_layout = QHBoxLayout()
        self.add_button = QPushButton("Add")
        self.remove_button = QPushButton("Remove")
        button_layout.addWidget(self.add_button)
        button_layout.addWidget(self.remove_button)
        layout.addLayout(button_layout)

        # Selected licenses
        self.selected_licenses = QListWidget()
        layout.addWidget(QLabel("Selected Licenses:"))
        layout.addWidget(self.selected_licenses)

        # Connect buttons to functions
        self.add_button.clicked.connect(self.add_license)
        self.remove_button.clicked.connect(self.remove_license)

        self.setLayout(layout)

    def add_license(self):
        """Add a license to the list of selected licenses."""
        license_title = self.license_list.currentText()
        # Check for duplicates
        if not any(
            license_title == self.selected_licenses.item(i).text() for i in range(self.selected_licenses.count())
        ):
            self.selected_licenses.addItem(license_title)
        else:
            QMessageBox.warning(self, "Duplicate", "This license is already added.")

    def remove_license(self):
        selected_item = self.selected_licenses.currentItem()
        if selected_item:
            self.selected_licenses.takeItem(self.selected_licenses.row(selected_item))
        else:
            QMessageBox.warning(self, "No Selection", "Please select a license to remove.")

    def get_list_of_licenses(self):
        """Reads a list of licenses from an asset file.

        Each license in an object specified by the Datapackage standard.

        Example:
        {
          "name": "AGPL-3.0",
          "path": "https://opensource.org/licenses/AGPL-3.0",
          "title": "GNU Affero General Public License v3"
        }
        """
        result = []
        with open(Paths.asset("licenses.json")) as file:
            result = json.load(file)
        return result

    def get_selected_licenses(self):
        """Returns the list of selected licenses.

        This will be used to set the license field of the resource when saving the metadata.
        """
        selected = []
        for index in range(self.selected_licenses.count()):
            title = self.selected_licenses.item(index).text()
            license_obj = filter(lambda lic: lic["title"] == title, self.licenses)
            selected.extend(license_obj)
        return selected

    def populate(self, metadata):
        for lic in metadata.get("resource").licenses:
            self.selected_licenses.addItem(lic["title"])

    def retranslateUI(self):
        # TODO: implement translations
        pass


class SingleFieldForm(QWidget):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.setAttribute(Qt.WA_StyledBackground, True)
        main_layout = QVBoxLayout(self)
        form_layout = QFormLayout()
        self.name = QLineEdit()
        self.name_label = QLabel()
        form_layout.addRow(self.name_label, self.name)
        # name is read-only since is always updated to the contents of the first row of the file.
        self.name.setDisabled(True)
        self.types = NoWheelComboBox()
        self.types.addItems(
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
        self.type_label = QLabel()
        form_layout.addRow(self.type_label, self.types)

        self.title_label = QLabel()
        self.title = QLineEdit()
        form_layout.addRow(self.title_label, self.title)

        self.description = QLineEdit()
        self.description_label = QLabel()
        form_layout.addRow(self.description_label, self.description)

        self.missing_values_label = QLabel()
        self.missing_values = QLineEdit()
        self.missing_values.setEnabled(False)
        form_layout.addRow(self.missing_values_label, self.missing_values)

        self.rdf_type = QLineEdit()
        self.rdf_type_label = QLabel()
        form_layout.addRow(self.rdf_type_label, self.rdf_type)

        self.constraints_label = QLabel()
        form_layout.addRow(self.constraints_label, self.create_constraint_fields())
        main_layout.addLayout(form_layout)

        # Add a horizontal line to separate the constraints from the rest of the form
        horizontal_line = QFrame()
        horizontal_line.setFrameShape(QFrame.HLine)
        horizontal_line.setFrameShadow(QFrame.Sunken)
        horizontal_line.setLineWidth(1)
        main_layout.addWidget(horizontal_line)

        self.setLayout(main_layout)
        self.retranslateUI()

    def create_constraint_fields(self):
        """
        Creates the constraint fields for the field form.

        Constraints are:
        - Required
        - Length
        - Pattern
        - Enum
        """
        constraint_container = QWidget()
        constraint_layout = QVBoxLayout(constraint_container)
        constraint_layout.setContentsMargins(0, 0, 0, 0)

        grid_container = grid_container = QGroupBox("")
        grid_layout = QGridLayout(grid_container)
        grid_layout.setContentsMargins(0, 0, 0, 0)

        self.constraint_required_label = QLabel()
        grid_layout.addWidget(self.constraint_required_label, 0, 0)
        self.constraint_required = QComboBox()
        self.constraint_required.addItems(["True", "False"])
        self.constraint_required.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        grid_layout.addWidget(self.constraint_required, 0, 1, 1, 3)

        self.constraint_min_length_label = QLabel()
        grid_layout.addWidget(self.constraint_min_length_label, 1, 0)
        self.constraint_min_length = QLineEdit()
        self.constraint_min_length.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        grid_layout.addWidget(self.constraint_min_length, 1, 1)

        self.constraint_max_length_label = QLabel()
        grid_layout.addWidget(self.constraint_max_length_label, 1, 2)
        self.constraint_max_length = QLineEdit()
        self.constraint_max_length.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        grid_layout.addWidget(self.constraint_max_length, 1, 3)

        self.constraint_enum_label = QLabel()
        grid_layout.addWidget(self.constraint_enum_label, 2, 0)
        self.constraint_enum = QLineEdit()
        self.constraint_enum.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        grid_layout.addWidget(self.constraint_enum, 2, 1)

        self.constraint_pattern_label = QLabel()
        grid_layout.addWidget(self.constraint_pattern_label, 2, 2)
        self.constraint_pattern = QLineEdit()
        self.constraint_pattern.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        grid_layout.addWidget(self.constraint_pattern, 2, 3)

        grid_layout.setColumnMinimumWidth(1, 100)
        grid_layout.setColumnMinimumWidth(3, 100)
        grid_layout.setColumnStretch(1, 1)
        grid_layout.setColumnStretch(3, 1)

        grid_layout.setHorizontalSpacing(10)

        constraint_layout.addWidget(grid_container)

        return constraint_container

    def populate(self, field):
        self.name.setText(field.name)
        self.types.setCurrentText(field.type)
        self.title.setText(field.title)
        self.description.setText(field.description)
        self.rdf_type.setText(field.rdf_type)

        self.constraint_min_length.setText(str(field.constraints.get("minLength", "")))
        self.constraint_max_length.setText(str(field.constraints.get("maxLength", "")))
        self.constraint_pattern.setText(field.constraints.get("pattern", ""))
        self.constraint_enum.setText(",".join(field.constraints.get("enum", [])))
        self.constraint_required.setCurrentText(str(field.constraints.get("required", False)))

    def retranslateUI(self):
        self.name_label.setText(self.tr("Name:"))
        self.type_label.setText(self.tr("Type:"))
        self.title_label.setText(self.tr("Title:"))
        self.description_label.setText(self.tr("Description:"))
        self.missing_values_label.setText(self.tr("Missing Values:"))
        self.rdf_type_label.setText(self.tr("RDF Type:"))
        self.constraints_label.setText(self.tr("Constraints"))

        self.constraint_required_label.setText(self.tr("Required:"))
        self.constraint_min_length_label.setText(self.tr("Min Length:"))
        self.constraint_max_length_label.setText(self.tr("Max Length:"))
        self.constraint_enum_label.setText(self.tr("Enum:"))
        self.constraint_pattern_label.setText(self.tr("Pattern:"))


class FieldsForm(QWidget):
    """Widget to dynamically display the field forms.

    This is a tricky widget since it has to dinamycally add/remove field forms
    inside a QScrollArea when we navigate between resources.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.scroll_area = QScrollArea(self)
        self.scroll_area.setWidgetResizable(True)
        self.setAttribute(Qt.WA_StyledBackground, True)

        self.container_widget = QWidget(objectName="fields_form_container")
        self.container_layout = QVBoxLayout()
        self.container_layout.setSpacing(0)
        self.container_layout.setContentsMargins(0, 0, 0, 0)
        self.container_widget.setLayout(self.container_layout)
        self.scroll_area.setWidget(self.container_widget)
        self.field_forms = []

    def remove_forms(self):
        for form in self.field_forms:
            self.container_layout.removeWidget(form)
            form.deleteLater()
        self.field_forms = []

    def populate(self, metadata):
        if self.field_forms:
            self.remove_forms()
        for field in metadata.get("resource").schema.fields:
            form = SingleFieldForm()
            form.populate(field)
            self.field_forms.append(form)
            self.container_layout.addWidget(form)

    def resizeEvent(self, event):
        """Ensure the QScrollArea resizes to fit the parent layout.

        I couldn't find a better way to rezise the QScrollArea to always fit
        the parent container. QScrollArea seems to have a particular behaviour
        related to sizes, specially on widgets that adds childrens dynamically:
        https://doc.qt.io/qtforpython-6/PySide6/QtWidgets/QScrollArea.html#size-hints-and-layouts
        """
        super().resizeEvent(event)
        self.scroll_area.setGeometry(self.rect())

    def retranslateUI(self):
        for form in self.field_forms:
            form.retranslateUI()


class SchemaForm(QWidget):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        layout = QFormLayout()
        self.name = QLineEdit()
        layout.addRow("Name: ", self.name)
        self.primary_key = QComboBox()
        layout.addRow("Primary Key: ", self.primary_key)
        self.title = QLineEdit()
        layout.addRow("Title: ", self.title)
        self.missing_values = QLineEdit()
        layout.addRow("Missing Values: ", self.missing_values)
        self.description = QLineEdit()
        layout.addRow("Description: ", self.description)
        self.setLayout(layout)

    def populate(self, metadata):
        resource = metadata["resource"]
        self.title.setText(resource.schema.title)
        self.name.setText(resource.schema.name)
        self.description.setText(resource.schema.description)
        # self.missing_values.setText(resource.schema.missing_values)
        self.primary_key.clear()
        self.primary_key.addItem("")  # Add empty option for non set PrimaryKey.
        for field in resource.schema.fields:
            self.primary_key.addItem(field.name)

        if len(resource.schema.primary_key) > 0:
            self.primary_key.setCurrentText(resource.schema.primary_key[0])

        if field.missing_values and len(resource.schema.missing_values) > 0:
            self.missing_values.setText(",".join(resource.schema.missing_values))

    def retranslateUI(self):
        # TODO: imeplement translations
        pass


class IntegrityForm(QWidget):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        layout = QFormLayout()

        self.hash = QLineEdit()
        layout.addRow("Hash: ", self.hash)
        self.fields = QSpinBox()
        layout.addRow("Fields: ", self.fields)
        self.bytes_field = QSpinBox()
        layout.addRow("Bytes: ", self.bytes_field)
        self.rows = QSpinBox()
        layout.addRow("Rows: ", self.rows)

        self.setLayout(layout)

    def populate(self, metadata):
        """Populate form fields.

        This could be populated by setting stats=True when infering metadata.
        Hash is a little bit tricky because it needs to be updated everytime we
        edit the file or Frictionless will return a validation error.
        """
        resource = metadata["resource"]
        if resource.hash:
            self.hash.setText(resource.hash)
        if resource.fields:
            self.fields.setValue(resource.fields)
        if resource.bytes:
            self.bytes_field.setValue(resource.bytes)
        if resource.rows:
            self.rows.setValue(resource.rows)

    def retranslateUI(self):
        # TODO: imeplement translations
        pass


class ResourceForm(QWidget):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.layout = QFormLayout()

        self.name = QLineEdit()
        self.layout.addRow("Name: ", self.name)
        self.path = QLineEdit()
        self.path.setEnabled(False)
        self.layout.addRow("Path: ", self.path)
        self.types = QComboBox()
        self.types.addItems(["file", "text", "json", "table"])
        self.layout.addRow("Type: ", self.types)
        self.scheme = QLineEdit()
        self.layout.addRow("Scheme: ", self.scheme)
        self.format = QLineEdit()
        self.layout.addRow("Format: ", self.format)
        self.title = QLineEdit()
        self.layout.addRow("Title: ", self.title)
        self.mediatype = QLineEdit()
        self.layout.addRow("Media Type: ", self.mediatype)
        self.description = QLineEdit()
        self.layout.addRow("Description: ", self.description)
        self.encoding = QLineEdit()
        self.layout.addRow("Encoding: ", self.encoding)

        self.setLayout(self.layout)

    def populate(self, metadata):
        """Populates all the form fields with the values of the resource"""
        resource = metadata["resource"]
        self.name.setText(resource.name)
        self.path.setText(resource.path)
        self.title.setText(resource.title)
        self.types.setCurrentText(resource.type)
        self.mediatype.setText(resource.mediatype)
        self.description.setText(resource.description)
        self.encoding.setText(resource.encoding)
        self.scheme.setText(resource.scheme)
        self.format.setText(resource.format)

    def retranslateUI(self):
        # TODO: imeplement translations
        pass


class FrictionlessResourceMetadataWidget(QWidget):
    def __init__(self, filepath=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.setAttribute(Qt.WA_StyledBackground, True)

        utils.set_common_style(self)

        # Sidebar menu
        self.tree = QTreeWidget()
        self.tree.setColumnCount(1)
        self.tree.setHeaderHidden(True)
        self.tree.setFixedWidth(200)
        self.tree.setIndentation(10)
        items = []
        for key, values in _RESOURCE_METADATA.items():
            item = QTreeWidgetItem([key])
            for value in values:
                child = QTreeWidgetItem([value])
                item.addChild(child)
            items.append(item)
        self.tree.insertTopLevelItems(0, items)
        self.tree.expandAll()
        self.tree.clicked.connect(self.switch_form)

        self.tree.setStyleSheet(
            """
            QTreeWidget {
                border: 1px solid #d0d0d0;
            }

            QTreeWidget::item:hover {
              color: #FFF;
              background: black;
            }

            QTreeWidget::item:selected {
              color: #FFF;
              background: gray;
            }
        """
        )

        # Metadata Forms
        self.forms_layout = QStackedLayout()
        self.forms = [
            SchemaForm(),
            FieldsForm(),
            ResourceForm(),
            IntegrityForm(),
            LicensesForm(),
            ContributorsForm(),
        ]
        for form in self.forms:
            self.forms_layout.addWidget(form)
        if filepath:
            self.metadata = self.get_or_create_metadata(filepath)
            self.resource = metadata.get("resource")
            for form in self.forms:
                form.populate(self.metadata)

        # Help
        help = QWidget()
        help.setMinimumHeight(100)
        help_layout = QVBoxLayout()
        self.title = QLabel("Resource")
        self.title.setStyleSheet("font-weight: bold;")

        help_description = QLabel("This is a long text that will be replaced with the actual help content.")
        help_description.setText(
            help_description.text() + ' <a href="https://specs.frictionlessdata.io/data-resource/">Learn more</a>'
        )
        help_description.setTextInteractionFlags(Qt.TextBrowserInteraction)
        help_description.setWordWrap(True)
        help_description.setOpenExternalLinks(True)

        help_layout.addWidget(self.title)
        help_layout.addWidget(help_description)

        help_layout.addStretch()
        help.setLayout(help_layout)

        self.h_layout = QHBoxLayout()
        self.h_layout.addWidget(self.tree)
        self.h_layout.addLayout(self.forms_layout)

        self.layout = QVBoxLayout()
        self.layout.addWidget(help, alignment=Qt.AlignmentFlag.AlignTop)
        self.layout.addLayout(self.h_layout)
        self.setLayout(self.layout)

    def switch_form(self, index):
        """Set the index of the Forms Stacked Layout to match the selected form."""
        # This order is the order in which we add the forms to the stacked layout in the
        # __init__ method. We could implement something more fancy but life is too short
        # to make complex stuff.
        form = index.data()
        if form == "Schema":
            self.forms_layout.setCurrentIndex(0)
            self.title.setText("Schema")
        elif form == "Column names":
            self.forms_layout.setCurrentIndex(1)
            self.title.setText("Column names")
        if form == "Resource":
            self.forms_layout.setCurrentIndex(2)
            self.title.setText("Resource")
        elif form == "Integrity":
            self.forms_layout.setCurrentIndex(3)
            self.title.setText("Integrity")
        elif form == "Licenses":
            self.forms_layout.setCurrentIndex(4)
            self.title.setText("Licenses")
        elif form == "Contributors":
            self.forms_layout.setCurrentIndex(5)
            self.title.setText("Contributors")

    def get_or_create_metadata(self, filepath):
        """Get or create a metadata object for the Resource.

        Metadata is a dict containing the Frictionless Metadata plus other metadata
        that ODE could require.

        Example:
        {
          "resource": "{...frictionless descriptor...}"
          "custom_ode_metadata": "custom_ode_metadata_value"
        }
        """
        file = File(filepath)
        metadata = dict()

        if not file.metadata_path.exists():
            file.metadata_path.parent.mkdir(parents=True, exist_ok=True)
            with system.use_context(trusted=True):
                resource = TableResource(filepath)
                resource.infer()
            with open(file.metadata_path, "w") as f:
                # Resource is not serializable, converting to dict before writing.
                metadata["resource"] = resource.to_descriptor()
                json.dump(metadata, f)
            # We want to return a Frictionless object, so we are plugging it back.
            metadata["resource"] = resource
            return metadata

        with open(file.metadata_path) as file:
            metadata = json.load(file)

        with system.use_context(trusted=True):
            resource = TableResource(metadata["resource"])
            resource.infer()
            metadata["resource"] = resource

        return metadata

    def populate_all_forms(self, filepath: Path) -> None:
        """Populates the form with the content of the descriptor."""

        # Shows dialect only for csv files
        self.show_hide_item("Dialect", filepath.suffix == ".csv")

        self.metadata = self.get_or_create_metadata(filepath)
        self.resource = self.metadata.get("resource")
        for form in self.forms:
            form.populate(self.metadata)

    def save_metadata_to_descriptor_file(self, table_model):
        """Collects all data from all forms and save the descriptor.

        descriptor is the name that frictionless give to the json file that
        stores all the Resource metadata.
        """
        for form in self.forms:
            if isinstance(form, ResourceForm):
                self.resource.name = form.name.text()
                self.resource.path = form.path.text()
                self.resource.title = form.title.text()
                self.resource.types = form.types.currentText()
                self.resource.mediatype = form.mediatype.text()
                self.resource.description = form.description.text()
                self.resource.encoding = form.encoding.text()
                self.resource.scheme = form.scheme.text()
                self.resource.format = form.format.text()
            elif isinstance(form, IntegrityForm):
                self.resource.hash = form.hash.text()
                self.resource.fields = form.fields.value()
                self.resource.bytes = form.bytes_field.value()
                self.resource.rows = form.rows.value()
            elif isinstance(form, SchemaForm):
                # SchemaForm
                self.resource.schema.name = form.name.text() or None
                self.resource.schema.title = form.title.text()
                self.resource.schema.primary_key = form.primary_key.currentText() or None
                # We remove the spaces from the missing values
                self.resource.schema.missing_values = [m.strip() for m in form.missing_values.text().split(",")]
                self.resource.schema.description = form.description.text()
            elif isinstance(form, FieldsForm):
                for i, field_form in enumerate(form.field_forms):
                    field = self.resource.schema.fields[i]
                    # field type cannot be updated directly, we need to use set_field_type
                    self.resource.schema.set_field_type(field.name, field_form.types.currentText())
                    field.title = field_form.title.text()
                    field.description = field_form.description.text()
                    # TODO: Fix it, a string is not a valid value for missing_values but an array
                    # field.missing_values = field_form.missing_values.text()
                    field.rdf_type = field_form.rdf_type.text()

                    constraints = {
                        "required": field_form.constraint_required.currentText() == "True",
                    }

                    min_length = field_form.constraint_min_length.text().strip()
                    if min_length:
                        constraints["minLength"] = int(min_length)

                    max_length = field_form.constraint_max_length.text().strip()
                    if max_length:
                        constraints["maxLength"] = int(max_length)

                    if field_form.constraint_enum.text():
                        constraints["enum"] = field_form.constraint_enum.text().split(",")

                    if field_form.constraint_pattern.text():
                        constraints["pattern"] = field_form.constraint_pattern.text()

                    field.constraints = constraints

                    # Update the field in the schema
                    self.resource.schema.set_field(field)
            elif isinstance(form, LicensesForm):
                self.resource.licenses = form.get_selected_licenses()
            elif isinstance(form, ContributorsForm):
                contributors = self.metadata.get("contributors", [])
                contributors.clear()
                for i in range(form.contributors_list.count()):
                    item = form.contributors_list.item(i)
                    widget = form.contributors_list.itemWidget(item)
                    contributors.append(widget.contributor)

        # In ODE the content of the file is always the source of truth, therefore our field names
        # should always be the content of the first row of our file. Field name is disable in FieldsForm
        # to simplify scenarios and data consistency.
        headers = table_model.get_header_data()
        assert len(headers) == len(self.resource.schema.fields)
        for i, header in enumerate(headers):
            self.resource.schema.fields[i].name = header

        self.metadata["resource"] = self.resource.to_descriptor()
        self.metadata["contributors"] = contributors
        file = File(self.resource.path)

        with open(file.metadata_path, "w") as f:
            print(f"Saving metadata {file.metadata_path}")
            json.dump(self.metadata, f)

    def show_hide_item(self, item_text: str, show: bool = True) -> None:
        """Show or hide a QTreeWidgetItem based on its text."""
        items = self.tree.findItems(item_text, Qt.MatchExactly)
        if len(items) != 1:
            raise ValueError(f"Item {item_text} not found or duplicated.")

        items[0].setHidden(not show)

    def retranslateUI(self):
        # TODO: implement translations
        for form in self.forms:
            form.retranslateUI()


class ContributorItemWidget(QWidget):
    """
    Widget to show a contributor in the list of contributors.
    We use a custom widget to show the contributor and the buttons to remove and edit it.
    """

    def __init__(self, contributor: dict, parent: QWidget = None):
        super().__init__(parent)
        layout = QHBoxLayout(self)
        self.contributor = contributor

        # We show only the name
        self.title_label = QLabel(contributor.get("title"))
        layout.addWidget(self.title_label)

        # Add extra space to the right
        layout.addStretch()

        self.details_button = QPushButton()
        layout.addWidget(self.details_button)

        self.remove_button = QPushButton()
        layout.addWidget(self.remove_button)

        # We delete the layout margins to avoid extra space
        layout.setContentsMargins(2, 2, 2, 2)
        self.setLayout(layout)
        self.retranslateUI()

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.details_button.setText(self.tr("Details"))
        self.remove_button.setText(self.tr("Remove"))


class ContributorsForm(QWidget):
    """
    Widget to show the list of contributors.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        layout = QVBoxLayout()
        self.add_contributor_button = QPushButton()
        self.add_contributor_button.clicked.connect(self.add_contributor_dialog)
        layout.addWidget(self.add_contributor_button)

        self.contributors_list = QListWidget()
        self.contributors_list.setAlternatingRowColors(True)
        self.title_name_default = "Contributor"

        # These buttons would be used on the Dialog to add/edit a contributor
        self.contributor_dialog_save_button = QPushButton()
        self.contributor_dialog_cancel_button = QPushButton()

        self.setStyleSheet(
            """
            QPushButton {
              font-size: 14px;
              font-weight: 500;
              color: #FFFFFF;
              background: gray;
              border-style: outset;
              border-width: 1px;
              border-radius: 4px;
              padding: 6px 8px;
            }
            QPushButton:hover {
              color: #FFF;
              background: black;
              border-color: #0288D1;
            }
        """
        )

        self.contributors_list.setStyleSheet(
            """
            QListView {
                alternate-background-color: #f2f2f2;
                background-color: #ffffff;
            }
            """
        )
        layout.addWidget(self.contributors_list)

        self.setLayout(layout)
        self.retranslateUI()

    def remove_contributor(self, item: dict):
        """
        Removes a contributor from the list of contributors.
        """
        row = self.contributors_list.row(item)
        self.contributors_list.takeItem(row)

    def add_contributor_dialog(self):
        """
        Shows a dialog to add a new contributor with default values.
        """
        contributor = {
            "title": f"{self.title_name_default} {self.contributors_list.count() + 1}",
            "email": "",
            "role": "",
            "path": "",
        }

        self.show_contributor_dialog(contributor)

    def show_contributor_dialog(self, contributor: dict, contributor_pos: int = None):
        """
        Shows a dialog to edit a contributor.
        """
        dialog = ContributorDialog(self, contributor, contributor_pos)
        dialog.exec()

    def add_contributor(self, contributor: dict, contributor_pos: int):
        """
        Adds a contributor to the list of contributors.
        """
        # Creates a QListWidgetItem and add it to the list
        item = QListWidgetItem(self.contributors_list)

        item_widget = ContributorItemWidget(contributor)
        item_widget.remove_button.clicked.connect(lambda: self.remove_contributor(item))
        item_widget.details_button.clicked.connect(lambda: self.show_contributor_dialog(contributor, contributor_pos))

        # Sets the correct size for the item based on the widget
        item.setSizeHint(item_widget.sizeHint())

        # Assign widget to the item created
        self.contributors_list.setItemWidget(item, item_widget)

    def update_contributor(self, contributor: dict, contributor_pos: int):
        """
        Updates a contributor in the list of contributors.
        """
        item = self.contributors_list.item(contributor_pos)
        item_widget = self.contributors_list.itemWidget(item)
        item_widget.title_label.setText(contributor.get("title"))
        item_widget.contributor = contributor

    def clear_contributors(self):
        """
        Removes all contributors from the list of contributors.
        """
        self.contributors_list.clear()

    def populate(self, metadata):
        """
        Populates the list of contributors with the contributors in the metadata.
        """

        self.clear_contributors()
        contributors = metadata.get("contributors", [])
        for contributor_pos, contributor in enumerate(contributors):
            self.add_contributor(contributor, contributor_pos)

    def retranslateUI(self):
        """
        Applies the translations to the labels.
        """
        self.add_contributor_button.setText(self.tr("Add Contributor"))
        self.title_name_default = self.tr("Contributor")
        self.contributor_dialog_save_button.setText(self.tr("Save"))
        self.contributor_dialog_cancel_button.setText(self.tr("Cancel"))

        # Update the translations of the contributors
        for i in range(self.contributors_list.count()):
            item = self.contributors_list.item(i)
            widget = self.contributors_list.itemWidget(item)
            widget.retranslateUI()


if __name__ == "__main__":
    app = QApplication([])
    metadata = FrictionlessResourceMetadataWidget(filepath="./data/valid.csv")
    metadata.showMaximized()
    metadata.show()
    sys.exit(app.exec())
