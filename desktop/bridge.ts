import { ipcMain, dialog } from 'electron'

export function createBridge({ serverPort }: { serverPort: number }) {
  ipcMain.handle('readServerUrl', async () => {
    return `http://localhost:${serverPort}`
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
