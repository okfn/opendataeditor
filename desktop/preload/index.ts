import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  readServerUrl: () => ipcRenderer.invoke('readServerUrl'),
  sendFatalError: (message: string) => ipcRenderer.invoke('sendFatalError', message),
  openDirectoryDialog: () => ipcRenderer.invoke('openDirectoryDialog'),
})
