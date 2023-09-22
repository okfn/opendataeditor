import os
import shutil

source = "server"
target = "build/server"

shutil.rmtree(target, ignore_errors=True)
shutil.copytree(source, target)
os.remove(f"{target}/build.py")

print(f"[server] Copied '{source}' to '{target}'")
