import { spawnFile } from './system'
import { createEnvFromProxyUrls } from './python'
import * as settings from './settings'
import * as types from './types'
import log from 'electron-log'

export async function runServer(props: {
  proxyUrls: types.IProxyUrls
  serverPort: number
}) {
  const { serverPort } = props
  log.info('[runServer]', { serverPort })

  // Start server
  const proc = spawnFile(
    settings.PYTHON_TARGET,
    ['-m', 'server', settings.APP_TMP, '--port', serverPort.toString()],
    {
      cwd: settings.DIST,
      env: createEnvFromProxyUrls(props.proxyUrls),
    }
  )

  return proc
}
