import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from './window'
import * as python from './python'
import * as settings from './settings'
import * as resources from './resources'
import log from 'electron-log'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  electronApp.setAppUserModelId(settings.APP_USER_MODEL_ID)

  try {
    log.info('Ensure initial resources')
    await resources.ensureExample()
    await resources.ensureRunner()
  } catch (error) {
    log.error(error)
  }

  try {
    log.info('Prepare python environment')
    await python.ensurePython()
    await python.ensureLibraries()
  } catch (error) {
    log.error(error)
  }

  try {
    log.info('Create main window')
    createWindow()
  } catch (error) {
    log.error(error)
  }
})

// Default open or close DevTools by F12 in development
// and ignore CommandOrControl + R in production.
// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window)
})

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
