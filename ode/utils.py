import json
import platform
import subprocess

from pathlib import Path

from frictionless.resources import TableResource
from frictionless import system

from ode import paths

from PySide6.QtWidgets import QMessageBox


def setup_ode_internal_folders():
    """Creates the folders to store the files and metadata files."""
    paths.METADATA_PATH.mkdir(parents=True, exist_ok=True)
    if platform.system() == "Windows":
        # Set the .metadata folder hidden so it is not shown in the ODE file navigator
        # This is the default behaviour in Linux/MacOs since the directory name starts with a dot.
        subprocess.run(["attrib", "+H", f"{str(paths.METADATA_PATH)}"], check=True)


def migrate_metadata_store():
    """Migrates all the metadata information to separated files.

    Previously ODE stored the Frictionless metadata and other info of
    every file in a single "records" dictionary stored in a metadata.json.
    This created several issues like: custom logic to deduplicate file names,
    a third database to link files with records, etc.

    We will now store metadata on independent files under a `.metadata` folder.
    Each file will have the same name of the original file with a `metadata.json` append.
    We will also mimic the folder structure.
    """
    # Path to ODE v1.3 metadata.json file
    metadata_file_path = paths.PROJECT_PATH / ".opendataeditor/metadata.json"
    if not metadata_file_path.exists():
        # ODE has never been used in this machine. Nothing to migrate.
        return

    new_metadata_dir = paths.PROJECT_PATH / ".metadata/"
    if new_metadata_dir.exists():
        # If folder exist we asume migrated and return.
        return

    ode_dir = paths.PROJECT_PATH / ".opendataeditor/"
    if ode_dir.exists() and platform.system() == "Windows":
        # Hid .opendataeditor directory. This directory is no longer used.
        subprocess.run(["attrib", "+H", f"{str(ode_dir)}"], check=True)

    # ODE v1.3 has been used and we need to migrate.
    with open(metadata_file_path, "r") as file:
        metadata = json.load(file)

    records = metadata["record"]

    for _, record_data in records.items():
        path = record_data["path"]
        try:
            # Infer Frictionless Statistics, it is mandatory for the newest version of ODE.
            with system.use_context(trusted=True):
                resource = TableResource(record_data.get("resource"))
                # Patch the original resource path with the absolute path to the file.
                resource.path = str(paths.PROJECT_PATH / path)
                resource.infer()
                record_data["resource"] = resource.to_descriptor()
        except Exception as e:
            # This should happen only if the user did file/metadata editing outside ODE.
            print(f"Error when creating TableResource: {e}")
            continue

        # Set metadata file name as <filename>.json
        # Example: my-file.csv -> my-file.json
        # Example: subfolder/my-file.csv -> subfolder/my-file.json
        filename = path.rsplit(".", 1)[0]
        metadata_filename = str(new_metadata_dir / filename) + ".json"

        # Ensure the directory structure exists
        # Example: if we are migrating a file located in a subfolder, we need to create
        # it before the json.dump file.
        Path(metadata_filename).parent.mkdir(parents=True, exist_ok=True)

        with open(metadata_filename, "w") as json_file:
            json.dump(record_data, json_file, indent=4)

    print("Migration completed successfully!")


def set_common_style(widget):
    widget.setStyleSheet("font-size: 17px;")


def show_error_dialog(message=None, title="Error"):
    if message is None:
        message = "An unexpected error occurred in the application."

    error_box = QMessageBox()
    error_box.setIcon(QMessageBox.Critical)
    error_box.setWindowTitle(title)
    error_box.setText("An error has occurred")
    error_box.setInformativeText(message)
    error_box.setStandardButtons(QMessageBox.Ok)

    return error_box.exec()


class ErrorTexts:
    ERROR_TITLES = {
        "missing-label": "Missing header",
        "duplicate-label": "Duplicated header",
        "blank-row": "Empty row",
        "type-error": "Type mismatch",
        "missing-cell": "Missing value",
        "extra-cell": "Extra cell",
        "blank-header": "Missing header",
    }

    ERROR_DESCRIPTIONS = {
        "missing-label": "A column in the header row has no name. Every column should have a unique, non-empty header.",
        "duplicate-label": "Two or more columns share the same name. Column names must be unique.",
        "blank-row": "This row has no data. Rows should contain at least one cell with data.",
        "type-error": "A cell value doesn't match the expected data type or format for the column.",
        "missing-cell": "This cell is missing data",
        "extra-cell": "This row has more values compared to the header row.",
        "blank-header": "A column in the header row has no name. Every column should have a unique, non-empty header.",
    }

    @classmethod
    def get_error_title(cls, error_type):
        """Returns a more user-friendly title if exists."""
        return cls.ERROR_TITLES.get(error_type, None)

    @classmethod
    def get_error_description(cls, error_type):
        """Returns a more user-friendly description if exists."""
        return cls.ERROR_DESCRIPTIONS.get(error_type, None)
