import os from 'os'
import { join } from 'path'

export const WIN = process.platform === 'win32'
export const HOME = os.homedir()

export const DIST = process.resourcesPath
export const DIST_PYTHON_VENV = join(DIST, 'python/pythonvenv.zip')
export const DIST_SERVER = join(DIST, 'server')

export const APP_NAME = 'opendataeditor'
export const APP_USER_MODEL_ID = 'org.opendataeditor'
export const APP_HOME = join(HOME, `.${APP_NAME}`)
export const APP_PYTHON = join(APP_HOME, 'runner')
export const APP_PYTHON_VENV = join(APP_HOME, 'python')
// APP_TMP will be the folder to upload files the first time the user opens the Application
export const APP_TMP = join(APP_HOME, 'tmp')

export const PYTHON_SOURCE = join(APP_PYTHON, WIN ? 'python.exe' : 'bin/python3')
export const PYTHON_TARGET = join(APP_PYTHON_VENV, WIN ? 'Scripts\\python.exe' : 'bin/python3')
