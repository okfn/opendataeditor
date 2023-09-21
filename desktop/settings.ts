import os from 'os'
import { join } from 'path'

export const HOME = os.homedir()
export const DIST = process.resourcesPath

export const APP_NAME = 'opendataeditor'
export const APP_HOME = join(HOME, `.${APP_NAME}`)
export const APP_USER_MODEL_ID = 'org.opendataeditor'

export const DIST_PYTHON_DIR = join(DIST, 'runner', 'python')
export const VENV_PYTHON_DIR = join(APP_HOME, 'python')
