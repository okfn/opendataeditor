import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import log from 'electron-log'

export async function ensurePython() {
  // ODE builds a Python 3.10 distribution and ships it with the app.
  // It is generated when running make build
  log.info('[ensurePython]', { path: settings.APP_PYTHON })

  let message = 'existed'
  if (!fs.existsSync(settings.APP_PYTHON)) {
    await fsp.mkdir(settings.APP_PYTHON, { recursive: true })
    await fsp.cp(settings.DIST_PYTHON, settings.APP_PYTHON, {
      recursive: true,
      verbatimSymlinks: true,
    })
    message = 'created'
  }

  log.info('[ensurePython]', { message })
}
