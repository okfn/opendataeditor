import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  sendFatalError: (message: string) => ipcRenderer.invoke('sendFatalError', message),
  openDirectoryDialog: () => ipcRenderer.invoke('openDirectoryDialog'),
  ensureLogs: (callback: any) =>
    ipcRenderer.on('ensureLogs', (_event, message: string) => callback(message)),
  closeDesktopApp: () => ipcRenderer.invoke('closeDesktopApp'),
})
