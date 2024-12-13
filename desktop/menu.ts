import { BrowserWindow, Menu, app, shell } from 'electron'
import { t } from 'i18next'

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [
          { label: t('about'), role: 'about' },
          { label: t('quit'), role: 'quit' },
        ],
      },
      {
        label: t('file'),
        submenu: [
          {
            label: t('add'),
            submenu: [
              {
                label: t('new-file'),
                click: async () => {
                  mainWindow.webContents.send('menuAddNewFile')
                },
              },
              {
                label: t('new-folder'),
                click: async () => {
                  // Adding the same as Add New File, because it's the same dialog
                  mainWindow.webContents.send('menuAddNewFile')
                },
              },
              {
                label: t('external-data'),
                click: async () => {
                  mainWindow.webContents.send('menuAddExternalFile')
                },
              },
            ],
          },
          {
            label: t('delete'),
            click: async () => {
              mainWindow.webContents.send('menuDeleteFile')
            },
          },
          {
            label: t('publish'),
            click: async () => {
              mainWindow.webContents.send('menuPublishFile')
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: t('undo'),
            click: async () => {
              mainWindow.webContents.send('menuUndo')
            },
          },
          {
            label: t('redo'),
            click: async () => {
              mainWindow.webContents.send('menuRedo')
            },
          },
        ],
      },
      {
        label: t('view'),
        submenu: [
          {
            label: t('toggle-metadata'),
            click: async () => {
              mainWindow.webContents.send('menuToggleMetadata')
            },
          },
          {
            label: t('toggle-errors'),
            click: async () => {
              mainWindow.webContents.send('menuToggleErrorsReport')
            },
          },
          {
            label: t('toggle-source'),
            click: async () => {
              mainWindow.webContents.send('menuToggleSource')
            },
          },
        ],
      },
      {
        label: t('help'),
        submenu: [
          {
            label: t('user-guide'),
            click: async () => {
              await shell.openExternal(
                'https://opendataeditor.okfn.org/documentation/getting-started/'
              )
            },
          },
          {
            label: t('report-issue'),
            click: async () => {
              await shell.openExternal('https://github.com/okfn/opendataeditor/')
            },
          },
        ],
      },
    ])
  )
}
