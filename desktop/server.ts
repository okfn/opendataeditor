import cp from 'child_process';
import * as settings from './settings';
import log from 'electron-log';
import http from 'http';

function isServerRunning() {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:4040/health', (res) => {
      if (res.statusCode === 200) {
        resolve(true)
      } else {
        resolve(false)
      }
    }).on('error', () => {
        resolve(false)
      });
  });
}

export async function pollServer() {
  const retries = 15;
  const delay = 1000;

  for (let i = 0; i < retries; i++) {
    if (await isServerRunning()) {
      log.info(`[FastAPI Server] Server is running on http://127.0.0.1:4040`)
      return true
    }
    log.error(`[FastAPI Server] Cannot access http://127.0.0.1:4040/health. Retrying...`)
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
  log.error(`[FastAPI Server] Server failed to start on http://127.0.0.1:4040 after ${retries} retries`)
  return false
}

export async function runServer() {
  log.info(`[FastAPI Server] Running backend server on port 4040`)

  const proc = cp.spawn(settings.SERVER_EXEC, [settings.APP_TMP])

  proc.stdout.on('data', (data) => log.info(`[FastAPI Server stdout] ${data.toString().trim()}`))
  proc.stderr.on('data', (data) => log.error(`[FastAPI Server stderr] ${data.toString().trim()}`))
  proc.on('close', (code) => {
    log.info('[FastAPI Server]', { message: `child process exited with code ${code}` })
  })
  process.on('exit', () => {
    log.info('[FastAPI Server]', { message: `exiting child process on node exit` })
    proc.kill()
  })
}
