from ode.paths import Paths


class TestPaths:
    def test_no_conflict(self, project_folder):
        test_file = project_folder / "tempfile.txt"
        result = Paths.get_unique_destination_filepath(test_file, project_folder)
        assert result == test_file

    def test_single_conflict(self, project_folder):
        # Create same temp file to generate a conflict
        (project_folder / "tempfile.txt").touch()
        result = Paths.get_unique_destination_filepath(project_folder / "tempfile.txt", project_folder)

        assert result == (project_folder / "tempfile(1).txt")

    def test_multiple_conflicts(self, project_folder):
        # Create two temp files to see if increased to the next one
        (project_folder / "tempfile.txt").touch()
        (project_folder / "tempfile(1).txt").touch()
        result = Paths.get_unique_destination_filepath(project_folder / "tempfile.txt", project_folder)
        assert result == (project_folder / "tempfile(2).txt")
