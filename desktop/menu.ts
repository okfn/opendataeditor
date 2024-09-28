import { app, Menu, MenuItemConstructorOptions, BrowserWindow } from 'electron'

const template = [
    {
        label: app.name,
        submenu: [
            { role: 'about' },
            { role: 'quit' }
        ] as MenuItemConstructorOptions[]
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
                                    // TODO
                                }
                        },
                        {
                            label: 'New folder',
                                click: async () => {
                                    // console.log( BrowserWindow.getAllWindows()[0].webContents )
                                    BrowserWindow.getAllWindows()[0].webContents.send('menu-clicked', 'add-new-folder')
                                }
                        },
                        {
                            label: 'External data',
                                click: async () => {
                                    // TODO
                                }
                        },
                    ]
            },
            {
                label: 'Delete',
                    click: async () => {
                        // TODO
                    }
            },
            {
                label: 'Publish',
                    click: async () => {
                        // TODO
                    }
            },
        ] as MenuItemConstructorOptions[]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
        ] as MenuItemConstructorOptions[]
    },
    {
        label: 'View',
        submenu: [
        {
            label: 'Metadata',
                click: async () => {
                    // TODO
                }
        },
        {
            label: 'Errors panel',
                click: async () => {
                    // TODO
                }
        },
        {
            label: 'Source',
                click: async () => {
                    // TODO
                }
        },
        ] as MenuItemConstructorOptions[]
    },
    {
    label: 'Help',
    submenu: [
        {
            label: 'ODE User guide',
            click: async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://opendataeditor.okfn.org/documentation/getting-started/')
            }
        },
        {
            label: 'Report an issue',
            click: async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://github.com/okfn/opendataeditor/')
            }
        }
    ] as MenuItemConstructorOptions[]
    },
]

export default Menu.buildFromTemplate(template)