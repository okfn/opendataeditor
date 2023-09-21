import os

server = "build/server"
python = "build/python"
datemark = "20230826"
basepath = "https://github.com/indygreg/python-build-standalone/releases/download"
filename = f"cpython-3.10.13+{datemark}-x86_64-unknown-linux-gnu-install_only.tar.gz"

os.system(f"rm -rf ${server}")
os.system(f"cp -r server ${server}")

os.system(f"mkdir -p ${python}")
os.system(f"curl -L {basepath}/{datemark}/{filename} --output {python}/{filename}")
os.system(f"tar -xzvf {python}/{filename}")
