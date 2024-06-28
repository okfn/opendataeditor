import cp from 'child_process'
import * as settings from './settings'
import log from 'electron-log'

export async function runServer() {
  log.info(`[FastAPI Server] Running backend server on port 4040`)

  // Start production server
  const proc = cp.spawn(settings.SERVER_EXEC, [settings.APP_TMP])

  proc.stdout.on('data', (data) => log.info(data.toString().trim()))
  proc.stderr.on('data', (data) => log.error(data.toString().trim()))
  proc.on('close', (code) => {
    log.info('[FastAPI Server]', { message: `child process exited with code ${code}` })
  })
  process.on('exit', () => {
    log.info('[FastAPI Server]', { message: `exiting child process on node exit` })
    proc.kill()
  })
  return proc
}
