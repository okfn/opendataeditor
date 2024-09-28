import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  sendFatalError: (message: string) => ipcRenderer.invoke('sendFatalError', message),
  openDirectoryDialog: () => ipcRenderer.invoke('openDirectoryDialog'),
  createNewFolder: (callback: (value: string) => {}) => ipcRenderer.on('menu-clicked', (_event, value) => callback(value)),

  ensureLogs: (callback: any) => ipcRenderer.on('ensureLogs', (_event, message: string) => callback(message)),
  openPathInExplorer: (path: string) => ipcRenderer.send('openPathInExplorer', path),
  getAppPath: () => ipcRenderer.send('getAppPath'),
  closeDesktopApp: () => ipcRenderer.invoke('closeDesktopApp'),
})
