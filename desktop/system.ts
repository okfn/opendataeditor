import cp from 'child_process'
import util from 'util'
import log from 'electron-log'
import portfinder from 'portfinder'
import { is } from '@electron-toolkit/utils'
import * as settings from './settings'
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

// TODO: consider using `ses.resolveProxy(url)` instead
// https://www.electronjs.org/docs/latest/api/session/#sesresolveproxyurl
// https://github.com/felicienfrancois/node-electron-proxy-agent/blob/master/index.js
export async function detectHttpProxyUrl() {
  log.info('[detectHttpProxyUrl]')

  const proxy = await getProxySettings()
  const url = proxy?.http ? proxy.http.toString() : undefined
  const message = proxy?.http
    ? `proxy detected: http://***@${proxy.http.host}:${proxy.http.port}`
    : `no proxy detected`

  log.info('[detectHttpProxyUrl]', { message })
  return url
}

export async function execFile(
  path: string,
  args: string[],
  opts?: { cwd?: string; env?: Record<string, string | undefined> }
) {
  log.info('[execFile]', { path, args, opts })

  const cwd = opts?.cwd
  const env = { ...process.env, ...opts?.env }
  const { stdout } = await execFilePromise(path, args, { cwd, env })
  return stdout
}

export async function spawnFile(
  path: string,
  args: string[],
  opts?: { cwd?: string; env?: Record<string, string | undefined> }
) {
  log.info('[spawnFile]', { path, args, opts })

  const cwd = opts?.cwd
  const env = { ...process.env, ...opts?.env }
  const proc = cp.spawn(path, args, { cwd, env })
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
