import os
from pathlib import Path

# This is the Project path where all files are stored and
# it will be hardcoded to the home folder of the user until
# we define how to properly handle projects in Open Data Editor.
PROJECT_PATH = Path.home() / '.opendataeditor/tmp'
METADATA_PATH = PROJECT_PATH / '.metadata'


class Paths:
    """Utility class to handle relative paths."""
    base = os.path.dirname(__file__)
    assets = os.path.join(base, "assets")

    @classmethod
    def asset(cls, filename):
        return os.path.join(cls.assets, filename)

    @classmethod
    def translation(cls, filename):
        return os.path.join(cls.assets, "translations", filename)

    @classmethod
    def get_unique_destination_filepath(cls, src_filepath) -> Path:
        """Returns a unique destination_filepath by appending a number if the file already exists.

        If the specified file already exists, the method will generate a new filename by
        appending a number in parentheses to the original name. For example:

          - For a file named 'myfile.csv', if it doesn't exist, it will return 'myfile.csv'.
          - If 'myfile.csv' already exists, it will return 'myfile(1).csv'.
          - If 'myfile(1).csv' also exists, it will return 'myfile(2).csv', and so on.
        """

        src_filepath = Path(src_filepath) if isinstance(src_filepath, str) else src_filepath

        destination_filepath = PROJECT_PATH / src_filepath.name

        # If already exists we increment to `filename (n) until we find one not taking
        counter = 1
        while destination_filepath.exists():
            destination_filepath = destination_filepath.with_stem(f"{src_filepath.stem}({counter})")
            counter += 1

        return destination_filepath
