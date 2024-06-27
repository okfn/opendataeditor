import os
import shutil
import PyInstaller.__main__


def build_assets():
    source = "desktop/assets"
    target = "build"

    os.makedirs(target, exist_ok=True)
    for name in os.listdir(source):
        shutil.copy(f"{source}/{name}", target)

    print(f"[assets] Copied '{source}' to '{target}'")


def build_server():
    """Build an executable file for the FastAPI server."""
    PyInstaller.__main__.run([
        'server/__main__.py',
        '--onefile',
        '--name', 'server',
        '--collect-all', 'frictionless',  # Frictionless depends on data files
        '--distpath', 'build/server'  # Output the file to the build folder
    ])


if __name__ == "__main__":
    build_assets()
    build_server()
