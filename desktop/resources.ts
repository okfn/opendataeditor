import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import log from 'electron-log'

export async function ensurePython() {
  // ODE builds a Python 3.10 distribution and ships it with the app.
  // It is generated when running make build
  log.info('[ensurePython]', { path: settings.APP_RUNNER })

  let message = 'existed'
  if (!fs.existsSync(settings.APP_RUNNER)) {
    await fsp.mkdir(settings.APP_RUNNER, { recursive: true })
    await fsp.cp(settings.DIST_RUNNER, settings.APP_RUNNER, {
      recursive: true,
      verbatimSymlinks: true,
    })
    message = 'created'
  }

  log.info('[ensurePython]', { message })
}
