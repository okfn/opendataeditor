import { BrowserWindow, ipcMain, dialog } from 'electron'

export function createBridge(mainWindow: BrowserWindow) {
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })
}
