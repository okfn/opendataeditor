import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import * as types from './types'
import { join } from 'path'
import log from 'electron-log'
import toml from 'toml'
import * as system from './system'

export async function ensurePython() {
  log.info('[ensurePython]', { path: settings.APP_PYTHON })

  let message = 'existed'
  if (!fs.existsSync(settings.APP_PYTHON)) {
    await system.execFile(settings.PYTHON_SOURCE, ['-m', 'venv', settings.APP_PYTHON])
    message = 'created'
  }

  log.info('[ensurePython]', { message })
}

export async function ensureLibraries(props: { proxyUrls: types.IProxyUrls }) {
  log.info('[ensureLibraries]')

  const required = await readRequiredLibraries()
  const installed = await readInstalledLibraries()
  const missing = required.filter((spec) => !installed.includes(spec))
  if (!missing.length) return

  await system.execFile(
    settings.PYTHON_TARGET,
    ['-m', 'pip', 'install', '--upgrade', '--disable-pip-version-check', ...missing],
    { env: createEnvFromProxyUrls(props.proxyUrls) }
  )

  log.info('[ensureLibraries]', { missing })
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

export function createEnvFromProxyUrls(proxyUrls: types.IProxyUrls) {
  // https://stackoverflow.com/a/41957788
  // https://stackoverflow.com/questions/8287628/proxies-with-python-requests-module
  return {
    // UNIX
    HTTP_PROXY: proxyUrls.http,
    HTTPS_PROXY: proxyUrls.https,
    // Windows
    http_proxy: proxyUrls.http,
    https_proxy: proxyUrls.https,
  }
}
