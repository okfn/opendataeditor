import { app, shell, Menu, MenuItemConstructorOptions, BrowserWindow } from 'electron'

export function createMenu(mainWindow: BrowserWindow) {
  return Menu.buildFromTemplate([
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
                // TODO
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
            // TODO
          },
        },
        {
          label: 'Publish',
          click: async () => {
            // TODO
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
            // TODO
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
      ] as MenuItemConstructorOptions[],
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
}

