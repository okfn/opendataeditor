import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  readServerUrl: () => ipcRenderer.invoke('readServerUrl'),
  openDirectoryDialog: () => ipcRenderer.invoke('openDirectoryDialog'),
})
