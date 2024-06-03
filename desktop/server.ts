import { spawnFile } from './system'
import * as settings from './settings'
import log from 'electron-log'

export async function runServer(props: { httpProxyUrl?: string; serverPort: number }) {
  const { serverPort } = props
  log.info('[runServer]', { serverPort })

  // Start server
  const proc = spawnFile(
    settings.PYTHON_TARGET,
    ['-m', 'server', settings.APP_TMP, '--port', serverPort.toString()],
    {
      cwd: process.resourcesPath,
      // frictionless-py uses `requests` for HTTP requests
      // https://stackoverflow.com/questions/8287628/proxies-with-python-requests-module
      env: {
        HTTP_PROXY: props.httpProxyUrl, // UNIX
        http_proxy: props.httpProxyUrl, // Windows
      },
    }
  )

  return proc
}
