import { shell, BrowserWindow } from 'electron'

import { resolve, join } from 'path'
import { is } from '@electron-toolkit/utils'
import log from 'electron-log'
import * as server from './server'
import EventEmitter from 'events'

const loadingEvents = new EventEmitter()

// @ts-ignore
import icon from './assets/icon.png?asset'

export async function createWindow() {

  var splashWindow = new BrowserWindow({
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, 'preload', 'index.js'),
    },
  });

  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, 'preload', 'index.js'),
    },
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  loadingEvents.on('finished', () => {
    splashWindow.close();
    log.info('Opening index.html')
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(resolve(__dirname, '..', 'client', 'index.html'))
    }
    mainWindow.maximize()
    mainWindow.show();
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  log.info('Opening loading.html')
  splashWindow.loadFile(resolve(__dirname, '..', 'client', 'loading.html'))
  splashWindow.maximize()

  if (!is.dev) await server.runServer()

  const serverStarted = await server.pollServer();
  if (!serverStarted) {
    throw new Error('Failed to start FastAPI server');
  }

  loadingEvents.emit('finished')
}
