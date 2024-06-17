import { ipcMain, dialog, app } from 'electron'
import log from 'electron-log'

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
}
