import cp from 'child_process'
import util from 'util'
import log from 'electron-log'
import portfinder from 'portfinder'
import { is } from '@electron-toolkit/utils'
import * as settings from './settings'
import * as types from './types'
import { getProxySettings } from 'get-proxy-settings'
const execFilePromise = util.promisify(cp.execFile)

export async function findPort() {
  log.info('[findPort]')

  const port = !is.dev
    ? await portfinder.getPortPromise({ port: settings.PORT_PROD })
    : settings.PORT_DEV

  log.info('[findPort]', { port })
  return port
}

// TODO: it only works if both HTTP ans HTTPS proxies are set
// If only one of them is set, the `get-proxy-settings` library fails
// We cannot use `ses.resolveProxy(url)` because it does not return credentials
export async function detectProxyUrls() {
  log.info('[detectProxyUrls]')
  const proxyUrls: types.IProxyUrls = {}

  try {
    const proxy = await getProxySettings()
    if (proxy?.http) proxyUrls.http = proxy.http.toString()
    if (proxy?.https) proxyUrls.https = proxy.https.toString()
  } catch {}

  log.info('[detectHttpProxyUrl]', { proxies: Object.keys(proxyUrls) })
  return proxyUrls
}

export async function execFile(
  path: string,
  args: string[],
  opts?: { cwd?: string; env?: Record<string, string | undefined> }
) {
  const cwd = opts?.cwd
  const thisEnv = opts?.env || {}
  const fullEnv = { ...process.env, ...opts?.env }
  log.info('[execFile]', { path, args, cwd, env: Object.keys(thisEnv) })

  const { stdout } = await execFilePromise(path, args, { cwd, env: fullEnv })
  return stdout
}

export async function spawnFile(
  path: string,
  args: string[],
  opts?: { cwd?: string; env?: Record<string, string | undefined> }
) {
  const cwd = opts?.cwd
  const thisEnv = opts?.env || {}
  const fullEnv = { ...process.env, ...opts?.env }
  log.info('[spawnFile]', { path, args, cwd, env: Object.keys(thisEnv) })

  const proc = cp.spawn(path, args, { cwd, env: fullEnv })
  proc.stdout.on('data', (data) => log.info(data.toString().trim()))
  proc.stderr.on('data', (data) => log.error(data.toString().trim()))
  proc.on('close', (code) => {
    log.info('[spawnFile]', { message: `child process exited with code ${code}` })
  })
  process.on('exit', () => {
    log.info('[spawnFile]', { message: `exiting child process on node exit` })
    proc.kill()
  })

  return proc
}
