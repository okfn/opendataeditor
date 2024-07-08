import * as store from '../store'
import delay from 'delay'
import * as settings from '@client/settings'
import { client } from '@client/client'
import { loadConfig } from './config'
import { loadFiles, selectFile } from './file'

export async function onStart() {
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
}

export async function onFileCreate(paths: string[]) {
  await loadFiles()

  store.setState('file-create-start', (state) => {
    state.event = { type: 'create', paths }
  })

  if (paths.length === 1) {
    selectFile(paths[0])
  }

  await delay(500)

  store.setState('file-create-end', (state) => {
    state.event = undefined
  })
}

export async function onFileDelete(path: string) {
  store.setState('file-delete-start', (state) => {
    state.event = { type: 'delete', paths: [path] }
  })

  await delay(500)
  await loadFiles()
  selectFile(undefined)

  store.setState('file-delete-end', (state) => {
    state.event = undefined
    state.record = undefined
    state.measure = undefined
  })
}

export async function onFileUpdate(path: string) {
  store.setState('file-update-start', (state) => {
    state.event = { type: 'update', paths: [path] }
  })

  selectFile(path)
  await delay(500)

  store.setState('file-update-end', (state) => {
    state.event = undefined
  })
}
