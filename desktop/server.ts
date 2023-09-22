import { spawnFile } from './system'
import portfinder from 'portfinder'
import * as settings from './settings'
import log from 'electron-log'

export async function startServer() {
  const port = await portfinder.getPortPromise({ port: 4040 })
  log.info('[startServer]', { port })

  const proc = spawnFile(
    settings.PYTHON,
    ['-m', 'server', settings.APP_EXAMPLE, '--port', port.toString()],
    process.resourcesPath
  )
  return { port, proc }
}
