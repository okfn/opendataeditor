import shutil

source = "server"
target = "build/server"

shutil.rmtree(target)
shutil.copytree(source, target)

print("[server] Copied 'server' to 'build/server'")
