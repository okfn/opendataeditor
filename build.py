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
    # Define the source and destination paths
    source_folder = os.path.expanduser('.python/opendataeditor')
    build_runner_folder = 'build/runner'
    zip_filename = 'pythonvenv'
    zip_filepath = os.path.join(build_runner_folder, zip_filename + '.zip')

    # Ensure the build/runner folder exists
    os.makedirs(build_runner_folder, exist_ok=True)

    # Create a zip file with
    with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, start=source_folder)
                zipf.write(file_path, arcname=arcname)

    # Verify if the zip file was created successfully
    if os.path.isfile(zip_filepath):
        print(f'Successfully zipped and copied to {zip_filepath}')
    else:
        print('Failed to zip the source folder.')


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
