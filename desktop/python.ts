import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import { join } from 'path'
import log from 'electron-log'
import toml from 'toml'
import * as system from './system'

const python = join(settings.APP_RUNNER, 'bin', 'python3')
const pip = join(settings.APP_PYTHON, 'bin', 'pip3')

export async function ensurePython() {
  log.info('[ensurePython]', settings.APP_PYTHON)

  let message = 'existed'
  if (!fs.existsSync(settings.APP_PYTHON)) {
    await system.execFile(python, ['-m', 'venv', settings.APP_PYTHON])
    message = 'created'
  }

  log.info('[ensurePython]', message)
}

export async function ensureLibraries() {
  log.info('[ensureLibraries]')

  const required = await readRequiredLibraries()
  const installed = await readInstalledLibraries()

  for (const spec of required) {
    if (installed.includes(spec)) continue
    await system.execFile(pip, [
      'install',
      spec,
      '--upgrade',
      '--disable-pip-version-check',
    ])
  }

  log.info('[ensureLibraries]', 'done')
}

export async function readRequiredLibraries() {
  log.info('[readRequiredLibraries]')

  const path = join(settings.DIST, 'pyproject.toml')
  const text = await fsp.readFile(path, 'utf-8')
  const data = toml.parse(text).project.dependencies

  log.info('[readRequiredLibraries]', data)
  return data
}

export async function readInstalledLibraries() {
  log.info('[readInstalledLibraries]')

  const text = await system.execFile(pip, [
    'list',
    '--format',
    'freeze',
    '--disable-pip-version-check',
  ])
  const data = text.split(/\r?\n/).map((line) => line.trim().toLowerCase())

  log.info('[readInstalledLibraries]', data)
  return data
}
