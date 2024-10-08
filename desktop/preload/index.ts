import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  sendFatalError: (message: string) => ipcRenderer.invoke('sendFatalError', message),
  openDirectoryDialog: () => ipcRenderer.invoke('openDirectoryDialog'),
  ensureLogs: (callback: any) =>
    ipcRenderer.on('ensureLogs', (_event, message: string) => callback(message)),
  openPathInExplorer: (path: string) => ipcRenderer.send('openPathInExplorer', path),
  getAppPath: () => ipcRenderer.send('getAppPath'),
  closeDesktopApp: () => ipcRenderer.invoke('closeDesktopApp'),

  // Menu events

  onMenuAddNewFile: (callback: () => void) => {
    ipcRenderer.on('menuAddNewFile', callback)
  },
})
