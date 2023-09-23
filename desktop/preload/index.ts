import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('opendataeditor', {
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
})
