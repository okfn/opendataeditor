import pytest
from ode import paths, main


@pytest.fixture(autouse=True)
def project_folder(tmp_path):
    # Patch the PROJECT_PATH to use temporary directory
    paths.PROJECT_PATH = tmp_path
    paths.METADATA_PATH = tmp_path / ".metadata"
    return tmp_path


@pytest.fixture(autouse=True)
def window(qtbot, project_folder):
    win = main.MainWindow()
    qtbot.addWidget(win)
    win.show()
    return win
