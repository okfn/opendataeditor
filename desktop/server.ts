import { spawnFile } from './system'
import timersp from 'timers/promises'
import * as settings from './settings'
import log from 'electron-log'
import * as settings from './settings'

export async function runServer({ serverPort }: { serverPort: number }) {
  log.info('[runServer]', { serverPort })
  const url = `http://localhost:${serverPort}`

  // Start server
  const proc = spawnFile(
    settings.PYTHON,
    ['-m', 'server', settings.APP_EXAMPLE, '--port', serverPort.toString()],
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

  return proc
}
