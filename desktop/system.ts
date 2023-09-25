import cp from 'child_process'
import util from 'util'
import log from 'electron-log'
import portfinder from 'portfinder'
import { is } from '@electron-toolkit/utils'
import * as settings from './settings'
const execFilePromise = util.promisify(cp.execFile)

export async function findPort() {
  log.info('[findPort]')

  const port = !is.dev
    ? await portfinder.getPortPromise({ port: settings.PORT_PROD })
    : settings.PORT_DEV

  log.info('[findPort]', { port })
  return port
}

export async function execFile(path: string, args: string[], cwd?: string) {
  log.info('[execFile]', { path, args, cwd })

  const { stdout } = await execFilePromise(path, args, { cwd })
  return stdout
}

export async function spawnFile(path: string, args: string[], cwd?: string) {
  log.info('[spawnFile]', { path, args, cwd })

  const proc = cp.spawn(path, args, { cwd })
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
