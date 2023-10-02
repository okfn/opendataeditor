from pathlib import Path

# General

HOME = str(Path.home())

APP_NAME = "opendataeditor"
APP_HOME = f"{HOME}/.{APP_NAME}"

ARTIFACTS_IDENTIFIER = "_artifacts"
BUFFER_SIZE = 1000
DEFAULT_HTTP_PORT = 4040
IGNORED_FOLDERS = [
    ".git",
    ".venv",
    ".cache",
    ".python",
    "coverage",
    "node_modules",
    ".pytest_cache",
    ".ruff_cache",
    "__pycache__",
    ".opendataeditor",
]
