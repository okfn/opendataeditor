import { Server } from './server'
import * as settings from './settings'

// Main

const server = new Server()
server.start({ port: settings.PORT })
