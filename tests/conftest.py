import pytest
import ode


@pytest.fixture(autouse=True)
def project_folder(tmp_path):
    # Patch the PROJECT_PATH to use temporary directory
    ode.paths.PROJECT_PATH = tmp_path
    ode.paths.METADATA_PATH = (tmp_path / ".metadata")
    return tmp_path
