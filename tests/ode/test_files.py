import json
import pytest

from ode.file import File


class TestFiles:
    def test_constructor(self, project_folder):
        p1 = project_folder / "example.csv"
        file = File(p1)

        assert file.path == p1
        assert file.metadata_path == (project_folder / ".metadata/example.json")

    def test_path_to_metadata_file(self, project_folder):
        p1 = project_folder / "example.csv"
        m1 = project_folder / ".metadata/example.json"
        assert File(p1).metadata_path == m1

    def test_path_to_metadata_subfolder(self, project_folder):
        p2 = project_folder / "subfolder/example-1.csv"
        m2 = project_folder / ".metadata/subfolder/example-1.json"
        assert File(p2).metadata_path == m2

    def test_path_to_metadata_folder(self, project_folder):
        p3 = project_folder / "subfolder/"
        p3.mkdir()
        m3 = project_folder / ".metadata/subfolder/"
        assert File(p3).metadata_path == m3

    def test_get_create_metadata(self, project_folder):
        p1 = project_folder / "example.csv"
        p1.write_text("name,age\nAlice,30\nBob,25")

        file = File(p1)
        metadata = file.get_or_create_metadata()
        assert file.metadata_path.exists()
        assert metadata["resource"]
        assert metadata["resource"].path == str(p1)

    def test_get_metadata_dict(self, project_folder):
        p1 = project_folder / "example.csv"
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = File(p1)
        file.get_or_create_metadata()
        metadata = file.get_metadata_dict(file.metadata_path)

        assert metadata
        assert isinstance(metadata, dict)
        assert metadata["resource"]["path"] == str(p1)
        assert (project_folder / ".metadata/example.json").exists()

    def test_rename_file(self, project_folder):
        p1 = project_folder / "example.csv"
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = File(p1)

        file.rename("bar")
        assert not p1.exists()
        assert (project_folder / "bar.csv").exists()

    def test_rename_folder(self, project_folder):
        m1 = project_folder / "subfolder"
        m1.mkdir()
        p1 = project_folder / "subfolder/example.csv"
        p1.write_text("name,age\nAlice,30\nBob,25")

        ode_folder = File(m1)
        ode_folder.rename("bar")

        assert not m1.exists()
        assert (project_folder / "bar").exists()
        assert (project_folder / "bar/example.csv").exists()

    def test_rename_raises_error_if_target_exist(self, project_folder):
        p1 = project_folder / "foo.csv"
        p1.write_text("foo")
        p2 = project_folder / "bar.csv"
        p2.write_text("bar")

        file = File(p1)
        with pytest.raises(OSError):
            file.rename("bar")

    def test_rename_also_updates_object_attributes(self, project_folder):
        p1 = project_folder / "example.csv"
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = File(p1)
        file.get_or_create_metadata()
        file.rename("bar")
        assert file.path == (project_folder / "bar.csv")
        assert str(file.metadata_path) == str(project_folder / ".metadata/bar.json")

    def test_rename_file_metadata(self, project_folder):
        p1 = project_folder / "example.csv"
        p1.write_text("name,age\nAlice,30\nBob,25")
        file = File(p1)
        file.get_or_create_metadata()
        file.rename("bar")

        metadata = file.get_metadata_dict(file.metadata_path)
        expected = project_folder / "bar.csv"

        assert metadata["resource"]["path"] == str(expected)

    def test_rename_folder_metadata(self, project_folder):
        """Test that renaming folders updates all metadata files of children files."""
        m1 = project_folder / "subfolder"
        m1.mkdir()
        p1 = project_folder / "subfolder/foo.csv"
        p1.write_text("name,age\nAlice,30\nBob,25")
        File(p1).get_or_create_metadata()
        p2 = project_folder / "subfolder/bar.csv"
        p2.write_text("name,age\nAlice,30\nBob,25")
        File(p2).get_or_create_metadata()

        file = File(m1)
        file.rename("new_name")

        assert (project_folder / ".metadata/new_name/foo.json").exists()
        assert (project_folder / ".metadata/new_name/bar.json").exists()

        metadata_path = project_folder / ".metadata/new_name/foo.json"
        with open(metadata_path) as f:
            metadata = json.load(f)
            assert metadata["resource"]["path"] == str(project_folder / "new_name/foo.csv")

        metadata_path = project_folder / ".metadata/new_name/bar.json"
        with open(metadata_path) as f:
            metadata = json.load(f)
            assert metadata["resource"]["path"] == str(project_folder / "new_name/bar.csv")

    def test_remove_file_and_metadata(self, project_folder):
        p1 = project_folder / "example.csv"
        p1.touch()
        file = File(p1)
        file.get_or_create_metadata()
        file.remove()

        assert file.path.exists() is False
        assert file.metadata_path.exists() is False

    def test_delete_folder_and_metadata(self, project_folder):
        m1 = project_folder / "subfolder"
        m1.mkdir()
        p1 = project_folder / "subfolder/foo.csv"
        p1.touch()
        f1 = File(p1)
        f1.get_or_create_metadata()
        p2 = project_folder / "subfolder/bar.csv"
        p2.touch()
        f2 = File(p2)
        f2.get_or_create_metadata()
        p3 = project_folder / "subfolder/zoo.csv"
        p3.touch()
        f3 = File(p3)  # f3 should not have a metadata fail and it should not fail when deleting.

        file = File(m1)
        file.remove()

        assert p1.exists() is False
        assert f1.metadata_path.exists() is False
        assert p2.exists() is False
        assert f2.metadata_path.exists() is False
        assert p3.exists() is False
        assert f3.metadata_path.exists() is False
