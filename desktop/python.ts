import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import { join } from 'path'
import log from 'electron-log'
import toml from 'toml'
import * as system from './system'

export async function ensurePythonVirtualEnvironment() {
  // When running, ODE will ensure that a virtual environment for dependencies exists
  log.info('[ensurePythonVirtualEnvironment]', { path: settings.APP_PYTHON_VENV })

  let message = 'existed'
  if (!fs.existsSync(settings.APP_PYTHON_VENV)) {
    await system.execFile(settings.PYTHON_SOURCE, ['-m', 'venv', settings.APP_PYTHON_VENV])
    message = 'created'
  }

  log.info('[ensurePythonVirtualEnvironment]', { message })
}

export async function ensurePythonRequirements() {
  // When running, ODE will ensure that all python dependencies are installed.
  log.info('[ensurePythonRequirements]')

  const required = await readRequiredLibraries()
  const installed = await readInstalledLibraries()
  const missing = required.filter((spec) => !installed.includes(spec))
  if (!missing.length) return

  await system.execFile(settings.PYTHON_TARGET, [
    '-m',
    'pip',
    'install',
    '--upgrade',
    '--disable-pip-version-check',
    ...missing,
  ])

  log.info('[ensurePythonRequirements]', { missing })
}

export async function readRequiredLibraries() {
  log.info('[readRequiredLibraries]')

  const path = join(settings.DIST, 'pyproject.toml')
  const text = await fsp.readFile(path, 'utf-8')
  const data = toml.parse(text).project.dependencies as string[]

  log.info('[readRequiredLibraries]', { data })
  return data
}

export async function readInstalledLibraries() {
  log.info('[readInstalledLibraries]')

  const text = await system.execFile(settings.PYTHON_TARGET, [
    '-m',
    'pip',
    'list',
    '--format',
    'freeze',
    '--disable-pip-version-check',
  ])
  const data = text.split(/\r?\n/).map((line) => line.trim().toLowerCase())

  log.info('[readInstalledLibraries]', { data })
  return data
}
