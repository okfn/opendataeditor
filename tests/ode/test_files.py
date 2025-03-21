import json
import pytest
import ode

from frictionless import system
from frictionless.resources import TableResource
from pathlib import Path

from ode import paths


class ODEFile:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.metadata = Path()

    def get_path_to_metadata_file(self):
        """Returns the path to the metadata file of the given file.

        Metadata is a JSON object that stores Fricionless Metadata and any other
        metadata required by ODE. All metadata files are going to be stored in a
        `.metadata` folder mimicing the file name and the structure of the project
        folder.

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

        return metadata_path / (self.path.stem + '.json')

    def get_or_create_metadata(self):
        """Get or create a metadata object for the Resource.

        Metadata is a dict containing the Frictionless Metadata plus other metadata
        that ODE could require.

        Example:
        {
          "resource": "{...frictionless descriptor...}"
          "custom_ode_metadata": "custom_ode_metadata_value"
        }
        """
        metadata_filepath = self.get_path_to_metadata_file()
        metadata = dict()

        if not metadata_filepath.exists():
            metadata_filepath.parent.mkdir(parents=True, exist_ok=True)
            with system.use_context(trusted=True):
                resource = TableResource(self.path)
                resource.infer(stats=True)
            with open(metadata_filepath, "w") as f:
                # Resource is not serializable, converting to dict before writing.
                metadata["resource"] = resource.to_descriptor()
                json.dump(metadata, f)
            # We want to return a Frictionless object, so we are plugging it back.
            metadata["resource"] = resource
            return metadata

        with open(metadata_filepath) as file:
            metadata = json.load(file)

        with system.use_context(trusted=True):
            resource = TableResource(metadata["resource"])
            resource.infer(stats=True)
            metadata["resource"] = resource

        return metadata


@pytest.fixture(autouse=True)
def project_folder(tmp_path):
    # Patch the PROJECT_PATH to use temporary directory
    ode.paths.PROJECT_PATH = tmp_path
    ode.paths.METADATA_PATH = (tmp_path / ".metadata")
    return tmp_path


class TestFiles():

    def test_get_get_path_to_metadata_file(self, project_folder):
        p1 = (project_folder / "example.csv")
        m1 = (project_folder / ".metadata/example.json")
        assert ODEFile(p1).get_path_to_metadata_file() == m1

        p2 = (project_folder / "subfolder/example-1.csv")
        m2 = (project_folder / ".metadata/subfolder/example-1.json")
        assert ODEFile(p2).get_path_to_metadata_file() == m2

        p3 = (project_folder / "subfolder/")
        p3.mkdir()
        m3 = (project_folder / ".metadata/subfolder/")
        assert ODEFile(p3).get_path_to_metadata_file() == m3

    def test_get_create_metadata(self, project_folder):
        p1 = (project_folder / "example.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")

        file = ODEFile(p1)
        m1 = file.get_path_to_metadata_file()
        metadata = file.get_or_create_metadata()
        assert m1.exists()
        assert metadata["resource"]
        assert metadata["resource"].path == str(p1)

    def test_get_metadata(self, project_folder):
        p1 = (project_folder / "example.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")

        file = ODEFile(p1)
        m1 = file.get_path_to_metadata_file()
        metadata = file.get_or_create_metadata()
