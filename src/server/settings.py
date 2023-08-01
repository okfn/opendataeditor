# General

# TODO: update when we have name
APPNAME = "fdapp"
ARTIFACTS_IDENTIFIER = "_artifacts"
BUFFER_SIZE = 1000
DEFAULT_HTTP_PORT = 4040

IGNORED_FOLDERS = [
    "node_modules",
    "logs" "*.logs",
    ".pyc",
    ".idea/",
    ".vscode/",
    "*.sublime*",
    ".DS_STORE",
    "npm-debug.log*",
    "package-lock.json",
    "/.cache",
    "*.sqlite",
    # Byte-compiled
    ".pytest_cache/",
    ".ruff_cache/",
    "__pycache__/",
    # Unit test / coverage
    ".coverage",
    ".coverage.*",
    "coverage.xml",
    "*.py[cod]",
    ".pytest_cache/",
    ".tox/",
    ".nox/",
    "cover/",
    "*.whl",
    # C
    "*.so"
    # Distribution
    "bin/",
    "build/",
    "develop-eggs/",
    "dist/",
    "downloads/",
    "eggs/",
    ".eggs/",
    "lib/",
    "lib64/",
    "parts",
    "sdist/",
    "var/",
    "wheels/",
    "share/python-wheels/",
    "*.egg-info/",
    ".installed.cfg",
    "*.egg",
    "MANIFEST"
    # Jupyter
    ".ipynb_checkpoints",
    # mypy
    ".mypy_cache/",
    ".dmypy.json",
    "dmypy.json",
]
