import { BrowserWindow, Menu, MenuItem } from 'electron'

export function createContextMenu(mainWindow: BrowserWindow) {
  mainWindow.webContents.on('context-menu', (_, props) => {
    const menu = new Menu()

    if (props.selectionText) {
      menu.append(new MenuItem({ label: 'Copy', role: 'copy' }))
    }

    if (props.isEditable) {
      menu.append(new MenuItem({ label: 'Copy', role: 'copy' }))
      menu.append(new MenuItem({ label: 'Cut', role: 'cut' }))
      menu.append(new MenuItem({ label: 'Paste', role: 'paste' }))
    }

    if (menu.items.length > 0) {
      menu.popup()
    }
  })
}
