import * as store from '../store'
import delay from 'delay'
import { loadFiles, selectFile } from './file'

export async function emitFileCreateEvent(paths: string[]) {
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

export async function emitFileDeleteEvent(path: string) {
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

export async function emitFileUpdateEvent(path: string) {
  store.setState('file-update-start', (state) => {
    state.event = { type: 'update', paths: [path] }
  })

  selectFile(path)
  await delay(500)

  store.setState('file-update-end', (state) => {
    state.event = undefined
  })
}
