import os from 'os'
import { join } from 'path'

export const HOME = os.homedir()

export const DIST = process.resourcesPath
export const DIST_EXAMPLE = join(DIST, 'example')
export const DIST_RUNNER = join(DIST, 'runner')
export const DIST_SERVER = join(DIST, 'server')

export const APP_NAME = 'opendataeditor'
export const APP_USER_MODEL_ID = 'org.opendataeditor'
export const APP_HOME = join(HOME, `.${APP_NAME}`)
export const APP_RUNNER = join(APP_HOME, 'runner')
export const APP_PYTHON = join(APP_HOME, 'python')
export const APP_EXAMPLE = join(APP_HOME, 'example')

export const PYTHON = join(APP_RUNNER, 'bin', 'python3')
export const PIP = join(APP_PYTHON, 'bin', 'pip3')
