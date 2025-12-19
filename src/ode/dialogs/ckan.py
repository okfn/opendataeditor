import json

import requests
from PySide6.QtCore import Signal
from PySide6.QtWidgets import (
    QCheckBox,
    QComboBox,
    QDialog,
    QFormLayout,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QScrollArea,
    QSpinBox,
    QTextEdit,
    QVBoxLayout,
)


class CKANExportDialog(QDialog):
    """Widget to create resources in CKAN instances."""

    resource_created = Signal(dict)

    def __init__(self, parent=None, filepath=None):
        super().__init__(parent)
        self.api_token = None
        self.base_url = None
        self.schema = None
        self.filepath = filepath
        self.init_ui()

    def init_ui(self):
        """Initialize the user interface."""
        self.setWindowTitle("CKAN Resource Creator")
        self.setMinimumSize(800, 600)

        # Main layout
        main_layout = QVBoxLayout()

        # Connection section
        connection_group = QGroupBox("CKAN Connection")
        connection_layout = QFormLayout()

        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("https://demo.ckan.org")
        connection_layout.addRow("CKAN URL:", self.url_input)

        self.api_token_input = QLineEdit()
        self.api_token_input.setPlaceholderText("Enter your API token")
        self.api_token_input.setEchoMode(QLineEdit.EchoMode.Password)
        connection_layout.addRow("API Token:", self.api_token_input)

        connection_group.setLayout(connection_layout)
        main_layout.addWidget(connection_group)

        # Buttons for connection
        button_layout = QHBoxLayout()

        self.connect_button = QPushButton("Connect and Load Schema")
        self.connect_button.clicked.connect(self.connect_and_load_schema)
        button_layout.addWidget(self.connect_button)

        self.clear_button = QPushButton("Clear Form")
        self.clear_button.clicked.connect(self.clear_form)
        button_layout.addWidget(self.clear_button)

        main_layout.addLayout(button_layout)

        # Dataset ID section
        dataset_group = QGroupBox("Dataset Information")
        dataset_layout = QFormLayout()

        self.dataset_id_input = QLineEdit()
        self.dataset_id_input.setPlaceholderText("Enter dataset ID where resource will be added")
        dataset_layout.addRow("Dataset ID:", self.dataset_id_input)

        dataset_group.setLayout(dataset_layout)
        main_layout.addWidget(dataset_group)

        # Scroll area for dynamic form
        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.form_layout = QFormLayout()
        self.scroll_area.setLayout(self.form_layout)

        self.resource_label = QLabel("Resource Fields")
        self.resource_label.setStyleSheet("font-weight: bold;")
        main_layout.addWidget(self.resource_label)
        main_layout.addWidget(self.scroll_area)

        # Create resource button
        self.create_button = QPushButton("Create Resource")
        self.create_button.clicked.connect(self.create_resource)
        self.create_button.setEnabled(False)
        main_layout.addWidget(self.create_button)

        # Status label
        self.status_label = QLabel("Not connected")
        self.status_label.setStyleSheet("color: gray;")
        main_layout.addWidget(self.status_label)

        self.setLayout(main_layout)

    def clear_form(self):
        """Clear all form fields."""
        # Clear dynamic form
        for i in reversed(range(self.form_layout.count())):
            widget = self.form_layout.itemAt(i).widget()
            if widget:
                widget.deleteLater()

        self.create_button.setEnabled(False)
        self.status_label.setText("Not connected")
        self.status_label.setStyleSheet("color: gray;")

    def connect_and_load_schema(self):
        """Connect to CKAN instance and load the resource schema."""
        self.base_url = self.url_input.text().strip()
        self.api_token = self.api_token_input.text().strip()
        dataset_id = self.dataset_id_input.text().strip()

        if not self.base_url:
            QMessageBox.warning(self, "Warning", "Please enter a CKAN URL")
            return

        if not dataset_id:
            QMessageBox.warning(self, "Warning", "Please enter a Dataset ID")
            return

        if not self.base_url.endswith('/'):
            self.base_url += '/'

        try:
            self.schema = self.get_resource_schema()

            self.clear_form()

            self.build_dynamic_form()

            self.create_button.setEnabled(True)
            self.status_label.setText(f"Connected to {self.base_url}")
            self.status_label.setStyleSheet("color: green;")

        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to connect: {str(e)}")
            self.status_label.setText("Connection failed")
            self.status_label.setStyleSheet("color: red;")

    def get_resource_schema(self) -> list:
        """
        Get the resource schema from CKAN.

        CKAN doesn't have a direct endpoint for resource schema, but we can:
        1. Try the scheming extension's schema endpoint if available
        2. Fall back to a default CKAN schema
        """
        # Try to get schema from scheming extension (common in many CKAN instances)
        scheming_url = f"{self.base_url}api/action/scheming_dataset_schema_show?type=dataset"

        headers = {
            "Authorization": self.api_token if self.api_token else None,
            "Content-Type": "application/json"
        }

        try:
            # First try scheming endpoint
            response = requests.get(scheming_url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    result = data.get("result", {}).get("resource_fields", [])
                    return result
            else:
                print(f"Failed fetching scheming endpoint: {response.content}")
        except:
            pass

        return self.get_default_schema()

    def get_default_schema(self) -> list:
        """Return a default schema based on CKAN's standard resource fields.

        We are ignoring CKAN's url field as we are only allowing upload of ODE existing files.
        """
        return [
            {
                "field_name": "name",
                "label": "Name",
                "preset": "text",
                "required": True,
                "help_text": "Name of the resource"
            },
            {
                "field_name": "description",
                "label": "Description",
                "preset": "markdown",
                "required": False,
                "form_placeholder": "Description of the resource"
            },
            {
                "field_name": "format",
                "label": "Format",
                "preset": "select",
                "choices": [
                    {"value": "CSV", "label": "CSV"},
                    {"value": "JSON", "label": "JSON"},
                    {"value": "XML", "label": "XML"},
                    {"value": "PDF", "label": "PDF"},
                    {"value": "XLS", "label": "Excel"},
                ],
                "required": False
            },
            {
                "field_name": "hash",
                "label": "File Hash",
                "preset": "text",
                "required": False,
                "help_text": "MD5 or SHA256 hash of the file"
            }
        ]

    def build_dynamic_form(self):
        """Build form fields dynamically based on the schema."""
        if not self.schema:
            return

        for field in self.schema:
            field_name = field.get("field_name")
            label = field.get("label", field_name)
            preset = field.get("preset", "text")
            required = field.get("required", False)
            # help_text = field.get("help_text", "")
            placeholder = field.get("form_placeholder", "")

            if field_name == "url":
                # Ignore URL as we only support file uploads.
                # The selected file will be appended to the POST request in create_resource
                continue

            # Create label with required indicator
            field_label = QLabel(f"{field_name}{' *' if required else ''}")
            field_label.setToolTip(str(label)) # Label could be a multilingual dict so we cast it to str.
            # if help_text:
            # TODO: Necessary? Help text can be multilingual
            #     field_label.setToolTip(help_text)

            # Create appropriate widget based on preset
            if preset == "text":
                widget = QLineEdit()
                if placeholder:
                    widget.setPlaceholderText(placeholder)

            elif preset == "markdown":
                widget = QTextEdit()
                widget.setMaximumHeight(100)

            elif preset == "number":
                widget = QSpinBox()
                widget.setRange(0, 1000000000)

            elif preset == "select":
                widget = QComboBox()
                choices = field.get("choices", [])
                for choice in choices:
                    widget.addItem(choice.get("label", ""), choice.get("value", ""))

            elif preset == "boolean":
                widget = QCheckBox()

            else:
                # Default to text input
                widget = QLineEdit()
                if placeholder:
                    widget.setPlaceholderText(placeholder)

            # Store field metadata in widget
            widget.setProperty("field_name", field_name)
            widget.setProperty("required", required)
            widget.setProperty("preset", preset)

            # Add to form
            self.form_layout.addRow(field_label, widget)

        # Add a note about required fields
        note_label = QLabel("* indicates required field")
        note_label.setStyleSheet("color: gray; font-style: italic;")
        self.form_layout.addRow(note_label)

    def create_resource(self):
        """Create the resource using the CKAN API."""
        if not self.base_url or not self.api_token:
            QMessageBox.warning(self, "Warning", "Please connect first")
            return

        dataset_id = self.dataset_id_input.text().strip()
        if not dataset_id:
            QMessageBox.warning(self, "Warning", "Please enter a Dataset ID")
            return

        # Collect form data
        resource_data = {"package_id": dataset_id}

        for i in range(self.form_layout.rowCount() - 1):  # -1 for the note label
            layout_item = self.form_layout.itemAt(i, QFormLayout.ItemRole.FieldRole)
            if layout_item:
                widget = layout_item.widget()
                if widget:
                    field_name = widget.property("field_name")
                    preset = widget.property("preset")
                    required = widget.property("required")

                    if field_name:
                        if preset == "text" and isinstance(widget, QLineEdit):
                            value = widget.text().strip()
                            if required and not value:
                                QMessageBox.warning(self, "Warning",
                                                   f"Field '{field_name}' is required")
                                return
                            resource_data[field_name] = value

                        elif preset == "markdown" and isinstance(widget, QTextEdit):
                            value = widget.toPlainText().strip()
                            if required and not value:
                                QMessageBox.warning(self, "Warning",
                                                   f"Field '{field_name}' is required")
                                return
                            resource_data[field_name] = value

                        elif preset == "number" and isinstance(widget, QSpinBox):
                            resource_data[field_name] = widget.value()

                        elif preset == "select" and isinstance(widget, QComboBox):
                            value = widget.currentData()
                            if not value:
                                value = widget.currentText()
                            resource_data[field_name] = value

                        elif preset == "boolean" and isinstance(widget, QCheckBox):
                            resource_data[field_name] = widget.isChecked()

        # Send to CKAN
        try:
            url = f"{self.base_url}api/action/resource_create"

            headers = {"Authorization": self.api_token}

            payload = {
                "package_id": dataset_id,
                "url": "",  # CKAN expects this field, but can be empty for uploads
                "url_type": "upload",
            }

            # Add form fields to payload
            for key, value in resource_data.items():
                if key not in ["package_id", "url", "url_type"]:  # Already added
                    payload[key] = value

            if not self.filepath:
                QMessageBox.warning(self, "Warning", "Couldn't get filepath. Aborting.")
                return

            # Open the file and send
            with open(str(self.filepath), 'rb') as file_obj:
                files = [('upload', (self.filepath.name, file_obj))]
                response = requests.post(url, headers=headers, data=payload, files=files)

            result = response.json()

            if response.status_code == 200 and result.get("success"):
                QMessageBox.information(self, "Success", "Resource created successfully!")
                self.resource_created.emit(result.get("result", {}))
                self.clear_form()
            else:
                error_msg = result.get("error", "Unknown error.")
                QMessageBox.critical(self, "Error", f"Failed to create resource: {error_msg}")

        except requests.exceptions.RequestException as e:
            QMessageBox.critical(self, "Error", f"Network error: {str(e)}")
        except json.JSONDecodeError:
            QMessageBox.critical(self, "Error", "Invalid response from server")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Unexpected error: {str(e)}")
