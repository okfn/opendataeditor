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
        submenu: [{ role: 'undo' }, { role: 'redo' }],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Metadata',
            click: async () => {
              mainWindow.webContents.send('menuToggleMetadata')
            },
          },
          {
            label: 'Errors panel',
            click: async () => {
              // TODO
            },
          },
          {
            label: 'Source',
            click: async () => {
              // TODO
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

