import os
import shutil
import tarfile

import fsspec


def build_example():
    source = "example"
    target = "build/example"

    shutil.rmtree(target, ignore_errors=True)
    shutil.copytree(source, target)

    print(f"[example] Copied '{source}' to '{target}'")


def build_runner():
    cache = ".cache"
    target = "build/runner"
    platforms = ["linux", "mac", "win"]

    os.makedirs(cache, exist_ok=True)
    shutil.rmtree(target, ignore_errors=True)

    for platform in platforms:
        datemark = "20230826"
        basepath = "https://github.com/indygreg/python-build-standalone/releases/download"
        filetype = "x86_64-unknown-linux-gnu-install_only"
        if platform == "mac":
            filetype = "x86_64-apple-darwin-install_only"
        if platform == "win":
            filetype = "x86_64-pc-windows-msvc-static-install_only"
        filename = f"cpython-3.10.13+{datemark}-{filetype}.tar.gz"

        if not os.path.exists(f"{cache}/{filename}"):
            local = fsspec.filesystem("file")
            remote = fsspec.filesystem("http")
            with local.open(f"{cache}/{filename}", "wb") as file_to:
                with remote.open(f"{basepath}/{datemark}/{filename}", "rb") as file_from:
                    file_to.write(file_from.read())

        platform_target = f"{target}/{platform}"
        with tarfile.open(f"{cache}/{filename}", "r:gz") as tar:
            tar.extractall(cache)
            shutil.move(f"{cache}/python", platform_target)

        print(f"[runner] Copied '{platform}' runner to '{platform_target}'")


def build_server():
    source = "server"
    target = "build/server"

    shutil.rmtree(target, ignore_errors=True)
    shutil.copytree(source, target)

    print(f"[server] Copied '{source}' to '{target}'")


if __name__ == "__main__":
    build_example()
    build_runner()
    build_server()
