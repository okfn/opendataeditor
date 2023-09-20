import shell from 'shelljs'

// shell.config.verbose = true

const source = 'build/desktop'
const target = `${source}/python`
const datemark = '20230826'
const basepath = 'https://github.com/indygreg/python-build-standalone/releases/download'
const filename = `cpython-3.10.13+${datemark}-x86_64-unknown-linux-gnu-install_only.tar.gz`

if (!shell.test('-d', target)) {
  shell.exec(`wget ${basepath}/${datemark}/${filename} -P ${source}`)
  shell.exec(`tar -xzvf ${source}/${filename}`)
}
