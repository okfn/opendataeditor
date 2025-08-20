import json
import shutil
import logging

from frictionless import system
from frictionless.resources import TableResource
from frictionless.formats.excel import ExcelControl
from pathlib import Path

from ode import paths

logger = logging.getLogger(__name__)


class File:
    """Class to interact with a File and it's associated Metadata.

    In ODE, every file has a corresponding metadata file that stores Fricionless Metadata
    and any other metadata required by ODE. All metadata files are going to be stored in a
    `.metadata` folder mimicing the file name and the structure of the project folder.

    Everytime the name or the location of the file changes, we need to update it's metadata file
    as well, so this class will implement all methods required to keep synchronized all the information.

    Metadata file example:
        {
          "resource": "{...frictionless descriptor...}"
          "custom_ode_metadata": "custom_ode_metadata_value"
        }
    """

    def __init__(self, path: str | Path) -> None:
        self.path: Path = path if isinstance(path, Path) else Path(path)
        self.metadata_path: Path = self._get_path_to_metadata_file()

    def get_metadata_dict(self) -> dict:
        """Returns the ODE metadata dictionary for the current file.

        The difference with get_or_create_metadata is that this method will not return
        a Frictionless TableResource object in the record key, just a JSON object.
        """
        with open(self.metadata_path) as file:
            metadata = json.load(file)
        return metadata

    def set_metadata_dict(self, metadata: dict) -> None:
        with open(self.metadata_path, mode="w") as file:
            json.dump(metadata, file)

    def _get_path_to_metadata_file(self) -> Path:
        """Returns the path to the metadata file of the given file.

        Example 1:
          - File: Paths.PROJECT_FOLDER / 'myfile.csv'
          - Metadata: Paths.PROJECT_FOLDER / '.metadata/myfile.json'

        Example 2 (subfolder):
          - File: Paths.PROJECT_FOLDER / 'subfolder/invalid-file.csv'
          - Metadata: Paths.PROJECT_FOLDER / '.metadata/subfolder/invalid-file.json'

        Example 3 (input is folder):
          - Folder: Paths.PROJECT_FOLDER / 'subfolder'
          - Metadata: Paths.PROJECT_FOLDER / '.metadata/subfolder'
        """
        relative_path = self.path.parent.relative_to(paths.PROJECT_PATH)
        metadata_path = paths.METADATA_PATH / relative_path

        if self.path.is_dir():
            return metadata_path / self.path.stem

        return metadata_path / (self.path.stem + ".json")

    def get_or_create_metadata(self, sheet_name: str | None = None):
        """Get or create a metadata object for the Resource.

        Sheet name is used to specify which sheet of the Excel file we want to use.
        """
        if self.metadata_path.exists():
            metadata = dict()
            with open(self.metadata_path) as file:
                metadata = json.load(file)

            with system.use_context(trusted=True):
                if sheet_name:
                    logger.info("Using sheet %s for resource %s", sheet_name, self.path)
                    resource = TableResource(metadata["resource"], control=ExcelControl(sheet=sheet_name))
                else:
                    logger.info("Using resource %s", self.path)
                    resource = TableResource(metadata["resource"])

                resource.infer()
                metadata["resource"] = resource
        else:
            # If the metadata file does not exist, we create it.
            metadata = self._setup_metadata_first_time(sheet_name)

        return metadata

    def _setup_metadata_first_time(self, sheet_name: str | None = None):
        print("Setting up metadata for", sheet_name)
        metadata = dict()
        self.metadata_path.parent.mkdir(parents=True, exist_ok=True)
        with system.use_context(trusted=True):
            print(sheet_name)
            if sheet_name:
                resource = TableResource(self.path, control=ExcelControl(sheet=sheet_name))
            else:
                resource = TableResource(self.path)

            resource.infer()

        with open(self.metadata_path, "w") as f:
            # Resource is not serializable, converting to dict before writing.
            metadata["resource"] = resource.to_descriptor()
            json.dump(metadata, f)

        # We want to return a Frictionless object, so we are plugging it back.
        metadata["resource"] = resource
        return metadata

    def rename(self, new_name):
        """Rename a file and the corresponding metadata file.

        Whenever we rename files we need to update a) the name of the metadata file and
        b) the Frictionless path attribute. When renaming a folder, we need to ensure that
        every metadata file of children files are updated as well.
        """
        new_path = self.path.with_stem(new_name)
        new_metadata_path = self.metadata_path.with_stem(new_name)

        if new_path.exists():
            raise OSError

        self.path.rename(new_path)

        # First we update metadata's path attribute to point to the renamed file/folder
        if self.metadata_path.is_file():
            metadata = self.get_metadata_dict()
            metadata["resource"]["path"] = str(new_path)
            self.set_metadata_dict(metadata)
            self.metadata_path.rename(new_metadata_path)
        elif self.metadata_path.is_dir():
            # If we are renaming a directory, we need to update all existing metadata files.
            for file in self.metadata_path.rglob("*.json"):
                metadata = dict()
                with open(file) as f:
                    metadata = json.load(f)
                # When renaming a directory the filename remains but we need to replace its
                # parent directory.
                current = metadata["resource"]["path"]
                metadata["resource"]["path"] = current.replace(str(self.path), str(new_path))
                with open(file, "w") as f:
                    json.dump(metadata, f)
            self.metadata_path.rename(new_metadata_path)

        # Update object attributes with the new values.
        self.path = new_path
        self.metadata_path = new_metadata_path

    def remove(self):
        """Remove a file from disk.

        When uploading a folder, the metadata folder does not exist until the first children file
        is open and validated. If the user uploads a folder and do not open any file,
        we will not have a metadata folder. We check if it exist before deleting to ignore errors.
        """
        if self.path.is_file():
            self.path.unlink()
            if self.metadata_path.exists():
                self.metadata_path.unlink()
        elif self.path.is_dir():
            shutil.rmtree(self.path)
            if self.metadata_path.exists():
                shutil.rmtree(self.metadata_path)
