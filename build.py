import os
import shutil
import tarfile

import fsspec


def build_example():
    source = "example"
    target = "build/example"

    shutil.rmtree(target, ignore_errors=True)
    shutil.copytree(source, target)
    os.remove(f"{target}/__init__.py")
    os.remove(f"{target}/build.py")

    print(f"[example] Copied '{source}' to '{target}'")


def build_runner():
    cache = ".cache"
    target = "build/runner"
    datemark = "20230826"
    basepath = "https://github.com/indygreg/python-build-standalone/releases/download"
    filename = f"cpython-3.10.13+{datemark}-x86_64-unknown-linux-gnu-install_only.tar.gz"

    os.makedirs(cache, exist_ok=True)
    shutil.rmtree(target, ignore_errors=True)

    if not os.path.exists(f"{cache}/{filename}"):
        local = fsspec.filesystem("file")
        remote = fsspec.filesystem("http")
        with local.open(f"{cache}/{filename}", "wb") as file_to:
            with remote.open(f"{basepath}/{datemark}/{filename}", "rb") as file_from:
                file_to.write(file_from.read())

    with tarfile.open(f"{cache}/{filename}", "r:gz") as tar:
        tar.extractall(cache)
        shutil.move(f"{cache}/python", target)

    print(f"[runner] Downloaded runner and extracted into '{target}'")


def build_server():
    source = "server"
    target = "build/server"

    shutil.rmtree(target, ignore_errors=True)
    shutil.copytree(source, target)
    os.remove(f"{target}/build.py")

    print(f"[server] Copied '{source}' to '{target}'")


if __name__ == "__main__":
    build_example()
    build_runner()
    build_server()
