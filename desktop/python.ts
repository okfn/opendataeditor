import * as settings from './settings'

export async function ensureVenv() {
  if (!fs.existsSync(datasette_app_dir)) {
    await mkdir(datasette_app_dir)
  }
  let shouldCreateVenv = true
  if (fs.existsSync(venv_dir)) {
    // Check Python interpreter still works, using
    // ~/.datasette-app/venv/bin/python3.9 --version
    // See https://github.com/simonw/datasette-app/issues/89
    const venv_python = path.join(venv_dir, 'bin', 'python3.9')
    try {
      await this.execCommand(venv_python, ['--version'])
      shouldCreateVenv = false
    } catch (e) {
      fs.rmdirSync(venv_dir, { recursive: true })
    }
  }
  if (shouldCreateVenv) {
    await this.execCommand(findPython(), ['-m', 'venv', venv_dir])
  }
  return venv_dir
}
