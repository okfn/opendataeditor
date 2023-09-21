import os
import shutil

source = "example"
target = "build/example"

shutil.rmtree(target, ignore_errors=True)
shutil.copytree(source, target)
os.remove(f"{target}/__init__.py")
os.remove(f"{target}/build.py")

print(f"[example] Copied '{source}' to '{target}'")
