import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import log from 'electron-log'
import i18next from 'i18next'
import { dirname, join } from 'path'
import { createMenu } from './menu'
import * as settings from './settings'

export function createBridge() {
  ipcMain.handle('sendFatalError', async (_ev, message: string) => {
    log.error(message)
    await dialog.showMessageBox({
      type: 'error',
      title: 'Open Data Editor',
      message: 'Fatal error',
      detail: message,
    })
    app.quit()
  })

  ipcMain.handle('openDirectoryDialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Select a folder',
      properties: ['openDirectory'],
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })

  ipcMain.handle('openPathInExplorer', (_ev, path: string) => {
    const folder = dirname(join(settings.APP_TMP, path))
    shell.openPath(folder)
  })

  ipcMain.handle('closeDesktopApp', async () => {
    app.quit()
  })

  ipcMain.handle('changeLanguage', (_ev, code: string) => {
    const window = BrowserWindow.getFocusedWindow()

    if (window) {
      i18next.changeLanguage(code)
      createMenu(window)
    }
  })
}
