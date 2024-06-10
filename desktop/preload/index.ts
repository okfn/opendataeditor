import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  readServerUrl: () => ipcRenderer.invoke('readServerUrl'),
  sendFatalError: (message: string) => ipcRenderer.invoke('sendFatalError', message),
  openDirectoryDialog: () => ipcRenderer.invoke('openDirectoryDialog'),
  ensureLogs: (callback: any) => ipcRenderer.on('ensureLogs', (_event, message: string) => callback(message))
})
