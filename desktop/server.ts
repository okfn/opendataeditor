import { execFile } from './system'
import * as settings from './settings'

export async function startServer() {
  await execFile(
    settings.PYTHON,
    ['-m', 'server', settings.APP_EXAMPLE],
    process.resourcesPath
  )
}
