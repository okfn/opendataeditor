import json
import pytest
import ode

from frictionless import system
from frictionless.resources import TableResource
from pathlib import Path

from ode import paths


class ODEFile:
    def __init__(self, path: Path) -> None:
        self.path: Path = path
        self.metadata: Path = self.get_path_to_metadata_file()

    def get_metadata_dict(self) -> dict:
        with open(self.metadata) as file:
            metadata = json.load(file)
        return metadata

    def set_metadata_dict(self, metadata: dict) -> None:
        with open(self.metadata, mode="w") as file:
            json.dump(metadata, file)

    def get_path_to_metadata_file(self) -> Path:
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

    def rename(self, new_name):
        """Rename a file and the corresponding metadata file.

        Whenever we rename files we need to update a) the name of the metadata file and
        b) the Frictionless path attribute. When renaming a folder, we need to ensure that
        every metadata file of children files are updated as well.
        """
        new_path = self.path.with_stem(new_name)
        new_metadata_path = self.metadata.with_stem(new_name)

        if new_path.exists():
            raise OSError("File already exist.")

        self.path.rename(new_path)

        if self.metadata.is_file():
            metadata = self.get_metadata_dict()
            # Fricionless path attribute should point to the renamed file.
            metadata["resource"]["path"] = str(new_path)
            self.set_metadata_dict(metadata)
            self.metadata.rename(new_metadata_path)

        if self.metadata.is_dir():
            # If we are renaming a directory, we need to update all existing metadata files.
            for file in self.metadata.rglob("*.json"):
                metadata = dict()
                with open(file) as f:
                    metadata = json.load(f)
                current = metadata["resource"]["path"]
                # When renaming a directory the filename remains but we need to replace its
                # parent directory. So we just replace current path to the new one.
                metadata["resource"]["path"] = current.replace(str(self.path), str(new_path))
                with open(file, "w") as f:
                    json.dump(metadata, f)
            self.metadata.rename(new_metadata_path)

        # Update the objects attribute with the new values.
        self.path = new_path
        self.metadata = new_metadata_path


@pytest.fixture(autouse=True)
def project_folder(tmp_path):
    # Patch the PROJECT_PATH to use temporary directory
    ode.paths.PROJECT_PATH = tmp_path
    ode.paths.METADATA_PATH = (tmp_path / ".metadata")
    return tmp_path


class TestFiles():

    def test_constructor(self, project_folder):
        p1 = (project_folder / "example.csv")
        file = ODEFile(p1)

        assert file.path == p1
        assert file.metadata == (project_folder / ".metadata/example.json")

    def test_path_to_metadata_file(self, project_folder):
        p1 = (project_folder / "example.csv")
        m1 = (project_folder / ".metadata/example.json")
        assert ODEFile(p1).get_path_to_metadata_file() == m1

    def test_path_to_metadata_subfolder(self, project_folder):
        p2 = (project_folder / "subfolder/example-1.csv")
        m2 = (project_folder / ".metadata/subfolder/example-1.json")
        assert ODEFile(p2).get_path_to_metadata_file() == m2

    def test_path_to_metadata_folder(self, project_folder):
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

    def test_get_metadata_dict(self, project_folder):
        p1 = (project_folder / "example.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = ODEFile(p1)
        file.get_or_create_metadata()

        metadata = file.get_metadata_dict()
        assert metadata
        assert isinstance(metadata, dict)
        assert metadata["resource"]["path"] == str(p1)
        assert (project_folder / ".metadata/example.json").exists()

    def test_rename_file(self, project_folder):
        p1 = (project_folder / "example.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = ODEFile(p1)

        file.rename("bar")
        assert not p1.exists()
        assert (project_folder / "bar.csv").exists()

    def test_rename_folder(self, project_folder):
        m1 = (project_folder / "subfolder")
        m1.mkdir()
        p1 = (project_folder / "subfolder/example.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")

        ode_folder = ODEFile(m1)
        ode_folder.rename("bar")

        assert not m1.exists()
        assert (project_folder / "bar").exists()
        assert (project_folder / "bar/example.csv").exists()

    def test_rename_raises_error_if_target_exist(self, project_folder):
        p1 = (project_folder / "foo.csv")
        p1.write_text("foo")
        p2 = (project_folder / "bar.csv")
        p2.write_text("bar")

        file = ODEFile(p1)
        with pytest.raises(OSError):
            file.rename("bar")

    def test_rename_also_updates_object_attributes(self, project_folder):
        p1 = (project_folder / "example.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = ODEFile(p1)
        file.get_or_create_metadata()
        file.rename("bar")
        assert file.path == (project_folder / "bar.csv")
        assert str(file.metadata) == str(project_folder / ".metadata/bar.json")

    def test_rename_file_metadata(self, project_folder):
        p1 = (project_folder / "example.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = ODEFile(p1)
        file.get_or_create_metadata()
        file.rename("bar")

        metadata = file.get_metadata_dict()
        expected = (project_folder / "bar.csv")
        assert metadata["resource"]["path"] == str(expected)

    def test_rename_folder_metadata(self, project_folder):
        """Test that renaming folders updates all metadata files of children files."""
        m1 = (project_folder / "subfolder")
        m1.mkdir()
        p1 = (project_folder / "subfolder/foo.csv")
        p1.write_text("name,age\nAlice,30\nBob,25")
        ODEFile(p1).get_or_create_metadata()
        p2 = (project_folder / "subfolder/bar.csv")
        p2.write_text("name,age\nAlice,30\nBob,25")
        ODEFile(p2).get_or_create_metadata()

        file = ODEFile(m1)
        file.rename("new_name")

        assert (project_folder / ".metadata/new_name/foo.json").exists()
        assert (project_folder / ".metadata/new_name/bar.json").exists()

        metadata_path = (project_folder / ".metadata/new_name/foo.json")
        with open(metadata_path) as f:
            metadata = json.load(f)
            assert metadata["resource"]["path"] == str(project_folder / "new_name/foo.csv")

        metadata_path = (project_folder / ".metadata/new_name/bar.json")
        with open(metadata_path) as f:
            metadata = json.load(f)
            assert metadata["resource"]["path"] == str(project_folder / "new_name/bar.csv")
