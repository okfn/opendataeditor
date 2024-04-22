import { spawnFile } from './system'
import * as settings from './settings'
import log from 'electron-log'

export async function runServer({ serverPort }: { serverPort: number }) {
  log.info('[runServer]', { serverPort })

  // Start server
  const proc = spawnFile(
    settings.PYTHON_TARGET,
    ['-m', 'server', settings.APP_PROJECTS, '--port', serverPort.toString()],
    process.resourcesPath
  )

  return proc
}
