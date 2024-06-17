import { spawnFile } from './system'
import * as settings from './settings'
import log from 'electron-log'

export async function runServer() {
  log.info(`[Run FastAPI server on port 4040`)

  // Start production server
  const proc = spawnFile(
    settings.PYTHON_TARGET,
    ['-m', 'server', settings.APP_TMP, '--port', `4040`],
    process.resourcesPath
  )

  return proc
}
