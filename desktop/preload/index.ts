import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  sendFatalError: (message: string) => ipcRenderer.invoke('sendFatalError', message),
  openDirectoryDialog: () => ipcRenderer.invoke('openDirectoryDialog'),
  ensureLogs: (callback: any) =>
    ipcRenderer.on('ensureLogs', (_event, message: string) => callback(message)),
  openPathInExplorer: (path: string) => ipcRenderer.invoke('openPathInExplorer', path),
  getAppPath: () => ipcRenderer.send('getAppPath'),
  closeDesktopApp: () => ipcRenderer.invoke('closeDesktopApp'),
  changeLanguage: (code: string) => ipcRenderer.invoke('changeLanguage', code),

  // Menu events

  onMenuAddNewFile: (callback: () => void) => {
    ipcRenderer.on('menuAddNewFile', callback)
  },
  onMenuAddExternalFile: (callback: () => void) => {
    ipcRenderer.on('menuAddExternalFile', callback)
  },
  onDeleteFile: (callback: () => void) => {
    ipcRenderer.on('menuDeleteFile', callback)
  },
  onPublishFile: (callback: () => void) => {
    ipcRenderer.on('menuPublishFile', callback)
  },
  onToggleMetadata: (callback: () => void) => {
    ipcRenderer.on('menuToggleMetadata', callback)
  },
  onToggleErrorsReport: (callback: () => void) => {
    ipcRenderer.on('menuToggleErrorsReport', callback)
  },
  onToggleSource: (callback: () => void) => {
    ipcRenderer.on('menuToggleSource', callback)
  },
  onUndo: (callback: () => void) => {
    ipcRenderer.on('menuUndo', callback)
  },
  onRedo: (callback: () => void) => {
    ipcRenderer.on('menuRedo', callback)
  },
})
