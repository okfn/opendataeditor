import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import { join } from 'path'
import log from 'electron-log'
import toml from 'toml'
import * as system from './system'

export async function ensureVenv() {
  if (fs.existsSync(settings.VENV_PYTHON_DIR)) return
  const python = join(settings.DIST_PYTHON_DIR, 'bin', 'python3')
  await system.execFile(python, ['-m', 'venv', settings.VENV_PYTHON_DIR])
}

export async function ensureDeps() {
  const pip = join(settings.VENV_PYTHON_DIR, 'bin', 'pip3')
  const deps = await parseDependencies()
  for (const dep of deps) {
    await system.execFile(pip, ['install', `'${dep}'`, '--disable-pip-version-check'])
  }
}

async function parseDependencies() {
  const path = join(settings.DIST, 'pyproject.toml')
  const text = await fsp.readFile(path, 'utf-8')
  const deps = toml.parse(text).project.dependencies
  log.info('[parseDependencies:deps]', deps)
  return deps
}
