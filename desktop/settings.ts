import os from 'os'
import { join } from 'path'

export const HOME = os.homedir()

export const APP_NAME = 'opendataeditor'
export const APP_HOME = join(HOME, `.${APP_NAME}}`)

export const DIST_PYTHON_DIR = join(process.resourcesPath, 'runner', 'python')
export const VENV_PYTHON_DIR = join(APP_HOME, 'python')
