import os
import shutil

source = "example"
target = "build/example"

shutil.rmtree(target, ignore_errors=True)
shutil.copytree(source, target)
os.remove(f"{target}/build.py")

print("[example] Copied 'example' to 'build/example'")
