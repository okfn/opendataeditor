import os from 'os'
import { join } from 'path'

export const WIN = process.platform === 'win32'
export const HOME = os.homedir()
export const APP_NAME = 'opendataeditor'
export const APP_USER_MODEL_ID = 'org.opendataeditor'

// DIST point to the folder where the application will be installed in the OS
// opt in Linux and AppData in Windows
export const DIST = process.resourcesPath

// Folder in the OS where we will store data generated by the application
// Example: /home/<user>/.opendataeditor
export const APP_HOME = join(HOME, `.${APP_NAME}`)

// APP_TMP will be the folder to upload files the first time the user opens the Application
export const APP_TMP = join(APP_HOME, 'tmp')

// Path to the FastAPI executable file to be run by the Desktop Application
export const SERVER_EXEC = join(DIST, 'server/__main__', WIN ? '__main__.exe': '__main__')
