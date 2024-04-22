import fs from 'fs'
import fsp from 'fs/promises'
import * as settings from './settings'
import log from 'electron-log'

export async function ensureRunner() {
  log.info('[ensureRunner]', { path: settings.APP_RUNNER })

  let message = 'existed'
  if (!fs.existsSync(settings.APP_RUNNER)) {
    await fsp.mkdir(settings.APP_RUNNER, { recursive: true })
    await fsp.cp(settings.DIST_RUNNER, settings.APP_RUNNER, {
      recursive: true,
      verbatimSymlinks: true,
    })
    message = 'created'
  }

  log.info('[ensureRunner]', { message })
}
