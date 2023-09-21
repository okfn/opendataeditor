import os from 'os'
import { join } from 'path'

export const HOME = os.homedir()
export const ODET_HOME = join(HOME, '.odet')

export const DIST_PYTHON_DIR = join(process.resourcesPath, 'runner', 'python')
export const VENV_PYTHON_DIR = join(ODET_HOME, 'python')
