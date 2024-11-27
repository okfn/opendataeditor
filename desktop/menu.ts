import { app, shell, Menu, BrowserWindow } from 'electron'
import i18n from './i18n.mainconfig'

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [{ role: 'about' }, { role: 'quit' }],
      },
      {
        label: i18n.t('File'),
        submenu: [
          {
            label: i18n.t('Add'),
            submenu: [
              {
                label: i18n.t('new-file'),
                click: async () => {
                  mainWindow.webContents.send('menuAddNewFile')
                },
              },
              {
                label: i18n.t('new-folder'),
                click: async () => {
                  // Adding the same as Add New File, because it's the same dialog
                  mainWindow.webContents.send('menuAddNewFile')
                },
              },
              {
                label: i18n.t('external-data'),
                click: async () => {
                  mainWindow.webContents.send('menuAddExternalFile')
                },
              },
            ],
          },
          {
            label: i18n.t('delete'),
            click: async () => {
              mainWindow.webContents.send('menuDeleteFile')
            },
          },
          {
            label: i18n.t('publish'),
            click: async () => {
              mainWindow.webContents.send('menuPublishFile')
            },
          },
        ],
      },
      {
        label: i18n.t('edit'),
        submenu: [{
          label: i18n.t('undo'),
          click: async () => {
            mainWindow.webContents.send('menuUndo')
          },
        }, {
          label: i18n.t('redo'),
          click: async () => {
            mainWindow.webContents.send('menuRedo')
          },
        }],
      },
      {
        label: i18n.t('view'),
        submenu: [
          {
            label: i18n.t('toggle-metadata'),
            click: async () => {
              mainWindow.webContents.send('menuToggleMetadata')
            },
          },
          {
            label: i18n.t('toggle-errors'),
            click: async () => {
              mainWindow.webContents.send('menuToggleErrorsReport')
            },
          },
          {
            label: i18n.t('toggle-source'),
            click: async () => {
              mainWindow.webContents.send('menuToggleSource')
            },
          },
        ],
      },
      {
        label: i18n.t('help'),
        submenu: [
          {
            label: i18n.t('ODE-user-guide'),
            click: async () => {
              await shell.openExternal(
                'https://opendataeditor.okfn.org/documentation/getting-started/'
              )
            },
          },
          {
            label: i18n.t('report-an-issue'),
            click: async () => {
              await shell.openExternal('https://github.com/okfn/opendataeditor/')
            },
          },
        ],
      },
    ])
  )
}

