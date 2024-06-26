import os
import shutil
import zipfile


def build_assets():
    source = "desktop/assets"
    target = "build"

    os.makedirs(target, exist_ok=True)
    for name in os.listdir(source):
        shutil.copy(f"{source}/{name}", target)

    print(f"[assets] Copied '{source}' to '{target}'")


def build_python():
    """ Zip the Python virtual environment created by hatch.

    In order to be able to run a FastAPI server, we ship with ODE a
    zipped virtualenvironment with all the dependencies installed.
    """
    source_folder = os.path.expanduser('.python/opendataeditor')
    build_runner_folder = 'build/python'
    zip_filename = 'pythonvenv'
    zip_filepath = os.path.join(build_runner_folder, zip_filename + '.zip')

    os.makedirs(build_runner_folder, exist_ok=True)

    with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, start=source_folder)
                zipf.write(file_path, arcname=arcname)

    if os.path.isfile(zip_filepath):
        print(f'[build_python] Virtual environment zipped ({zip_filepath})')
    else:
        print('[build_python] Failed to zip the virtual environment.')


def build_server():
    source = "server"
    target = "build/server"

    shutil.rmtree(target, ignore_errors=True)
    shutil.copytree(source, target)

    print(f"[server] Copied '{source}' to '{target}'")


if __name__ == "__main__":
    build_assets()
    build_python()
    build_server()
