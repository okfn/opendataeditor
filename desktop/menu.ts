import { app, Menu, MenuItemConstructorOptions } from 'electron'

const isMac = process.platform === 'darwin'

const template = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }]: []) as MenuItemConstructorOptions[],
    // { role: fileMenu }
    {
        label: 'Fileyooo',
        submenu: [
            {
                label: 'Open file',
                click: async () => {
                    //doOpenFile()
                }
            }
        ] as MenuItemConstructorOptions[]
    },
    // { role: 'editMenu' }
  {
    label: 'Edituuuu',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
        : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
    ] as MenuItemConstructorOptions[]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ] as MenuItemConstructorOptions[]
  },
]

module.exports.mainMenu = Menu.buildFromTemplate(template)