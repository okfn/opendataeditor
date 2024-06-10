import { shell, BrowserWindow } from 'electron'

import { resolve, join } from 'path'
import { is } from '@electron-toolkit/utils'
import log from 'electron-log'
import * as server from './server'
import * as python from './python'
import * as resources from './resources'

const EventEmitter = require('events')
const loadingEvents = new EventEmitter()

// @ts-ignore
import icon from './assets/icon.png?asset'

export async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, 'preload', 'index.js'),
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  loadingEvents.on('finished', () => {
    log.info('Opening index.html')
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(resolve(__dirname, '..', 'client', 'index.html'))
    }
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  
  if (!is.dev) {
    log.info('Opening loading.html')
    mainWindow.loadFile(resolve(__dirname, '..', 'client', 'loading.html'))
    log.info('## Start server')
    mainWindow?.webContents.send('ensureLogs', "Ensuring Python is installed")
    await resources.ensurePython()
    mainWindow?.webContents.send('ensureLogs', "Ensuring Python virtual environment exists ")
    await python.ensurePythonVirtualEnvironment()
    mainWindow?.webContents.send('ensureLogs', "Ensuring Python requirements are installed")
    await python.ensurePythonRequirements()
    mainWindow?.webContents.send('ensureLogs', "Starting server")
    await server.runServer()
  }

  loadingEvents.emit('finished')
}
