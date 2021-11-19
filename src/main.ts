import { server } from './server'
import * as settings from './settings'

// Main

server.start({ port: settings.PORT })
