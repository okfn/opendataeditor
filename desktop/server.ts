import { execFile } from './system'
import * as settings from './settings'

export async function startServer() {
  await execFile(settings.PYTHON, ['-m', 'server'], process.resourcesPath)
}
