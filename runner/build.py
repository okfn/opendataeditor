import os
import shutil
import tarfile

import fsspec

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
    tar.extractall(target)

print(f"[runner] Downloaded runner and extracted into '{target}'")
