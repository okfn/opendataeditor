import { app, shell, Menu, BrowserWindow } from 'electron'

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [{ role: 'about' }, { role: 'quit' }],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Add',
            submenu: [
              {
                label: 'New file',
                click: async () => {
                  mainWindow.webContents.send('menuAddNewFile')
                },
              },
              {
                label: 'New folder',
                click: async () => {
                },
              },
              {
                label: 'External data',
                click: async () => {
                  // TODO
                },
              },
            ],
          },
          {
            label: 'Delete',
            click: async () => {
              mainWindow.webContents.send('menuDeleteFile')
            },
          },
          {
            label: 'Publish',
            click: async () => {
              mainWindow.webContents.send('menuPublishFile')
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [{
          label: 'Undo',
          click: async () => {
            mainWindow.webContents.send('menuUndo')
          },
        }, {
          label: 'Redo',
          click: async () => {
            mainWindow.webContents.send('menuRedo')
          },
        }],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Toggle Metadata Panel',
            click: async () => {
              mainWindow.webContents.send('menuToggleMetadata')
            },
          },
          {
            label: 'Toggle Errors Panel',
            click: async () => {
              mainWindow.webContents.send('menuToggleErrorsReport')
            },
          },
          {
            label: 'Toggle Source Panel',
            click: async () => {
              mainWindow.webContents.send('menuToggleSource')
            },
          },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'ODE User guide',
            click: async () => {
              await shell.openExternal(
                'https://opendataeditor.okfn.org/documentation/getting-started/'
              )
            },
          },
          {
            label: 'Report an issue',
            click: async () => {
              await shell.openExternal('https://github.com/okfn/opendataeditor/')
            },
          },
        ],
      },
    ])
  )
}

