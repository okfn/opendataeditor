import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import { join } from 'path'
import log from 'electron-log'
import toml from 'toml'
import * as system from './system'

export async function ensurePython() {
  log.info('[ensurePython]', settings.APP_PYTHON)

  let message = 'existed'
  if (!fs.existsSync(settings.APP_PYTHON)) {
    const python = join(settings.APP_RUNNER, 'bin', 'python3')
    await system.execFile(python, ['-m', 'venv', settings.APP_PYTHON])
    message = 'created'
  }

  log.info('[ensurePython]', message)
}

export async function ensureLibraries() {
  log.info('[ensureLibraries]')

  const pip = join(settings.APP_PYTHON, 'bin', 'pip3')
  const libs = await parseLibraries()
  for (const lib of libs) {
    await system.execFile(pip, ['install', `'${lib}'`, '--disable-pip-version-check'])
  }

  log.info('[ensureLibraries]', 'done')
}

export async function parseLibraries() {
  log.info('[parseLibraries]')

  const path = join(settings.DIST, 'pyproject.toml')
  const text = await fsp.readFile(path, 'utf-8')
  const libs = toml.parse(text).project.dependencies

  log.info('[parseLibraries]', libs)
  return libs
}
