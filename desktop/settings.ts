import os from 'os'
import { join } from 'path'

export const WIN = process.platform === 'win32'
export const HOME = os.homedir()

export const PORT_DEV = 4040
export const PORT_PROD = 4444

export const DIST = process.resourcesPath
export const DIST_RUNNER = join(DIST, 'runner')
export const DIST_SERVER = join(DIST, 'server')

export const APP_NAME = 'opendataeditor'
export const APP_USER_MODEL_ID = 'org.opendataeditor'
export const APP_HOME = join(HOME, `.${APP_NAME}`)
export const APP_RUNNER = join(APP_HOME, 'runner')
export const APP_PYTHON = join(APP_HOME, 'python')

export const PYTHON_SOURCE = join(APP_RUNNER, WIN ? 'python.exe' : 'bin/python3')
export const PYTHON_TARGET = join(APP_PYTHON, WIN ? 'Scripts\\python.exe' : 'bin/python3')
