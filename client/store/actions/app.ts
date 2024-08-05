import * as store from '../store'
import delay from 'delay'
import * as settings from '@client/settings'
import { client } from '@client/client'
import { loadConfig } from './config'
import { loadFiles } from './file'

export async function onAppStart() {
  // @ts-ignore
  const sendFatalError = window?.opendataeditor?.sendFatalError

  let ready = false
  let attempt = 0
  const maxAttempts = sendFatalError ? 300 : 3
  const delaySeconds = 1

  while (!ready) {
    try {
      await loadConfig(true)
      await loadFiles(true)
      ready = true
    } catch (error) {
      attempt += 1
      if (attempt >= maxAttempts) {
        const serverUrl = client.serverUrl
        const message = `Client cannot connect to server on "${serverUrl}"`
        sendFatalError ? sendFatalError(message) : alert(message)
      }
      await delay(delaySeconds * 1000)
    }
  }

  // Setup project sync polling
  setInterval(async () => {
    const result = await client.projectSync({})

    // Here we ignore errors for now and just update the files on success
    if (result instanceof client.Error) {
      return
    }

    store.setState('sync-files', (state) => {
      state.files = result.files
    })
  }, settings.PROJECT_SYNC_INTERVAL_MILLIS)

  // Register on windows close event handler
  window.onbeforeunload = (event) => {
    event.preventDefault()
  }
}

export async function closeApp() {}
