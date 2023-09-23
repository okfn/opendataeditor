import { spawnFile } from './system'
import timersp from 'timers/promises'
import portfinder from 'portfinder'
import * as settings from './settings'
import log from 'electron-log'

export async function startServer() {
  const port = await portfinder.getPortPromise({ port: 4040 })
  const url = `http://localhost:${port}`
  log.info('[startServer]', { url })

  // Start server
  const proc = spawnFile(
    settings.PYTHON,
    ['-m', 'server', settings.APP_EXAMPLE, '--port', port.toString()],
    process.resourcesPath
  )

  // Wait for server
  let ready = false
  let attempt = 0
  const maxAttempts = 10
  const delaySeconds = 1
  const checkUrl = `${url}/project/check`
  while (!ready) {
    try {
      const response = await fetch(checkUrl, { method: 'POST' })
      if (response.status !== 200) throw new Error()
      ready = true
    } catch {
      attempt += 1
      if (attempt >= maxAttempts) throw new Error('Server is not responding')
      await timersp.setTimeout(delaySeconds * 1000)
    }
  }

  return { port, proc }
}
