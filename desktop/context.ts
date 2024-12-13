import { BrowserWindow, Menu, MenuItem } from 'electron'
import { t } from 'i18next'

export function createContextMenu(mainWindow: BrowserWindow) {
  mainWindow.webContents.on('context-menu', (_, props) => {
    const menu = new Menu()

    if (props.selectionText) {
      menu.append(new MenuItem({ label: t('copy'), role: 'copy' }))
    }

    if (props.isEditable) {
      menu.append(new MenuItem({ label: t('copy'), role: 'copy' }))
      menu.append(new MenuItem({ label: t('cut'), role: 'cut' }))
      menu.append(new MenuItem({ label: t('paste'), role: 'paste' }))
    }

    if (menu.items.length > 0) {
      menu.popup()
    }
  })
}
