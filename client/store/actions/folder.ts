import * as store from '../store'
import { client } from '@client/client'
import { loadFiles, closeFile, selectFile } from './file'
import { emitFileEvent } from './event'

export async function copyFolder(path: string, toPath: string) {
  const result = await client.folderCopy({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('copy-folder-error', (state) => {
      state.error = result
    })
  }

  await loadFiles()
  emitFileEvent({ type: 'create', paths: [result.path] })
  await selectFile(result.path)
}

export async function createFolder(path: string) {
  const result = await client.folderCreate({ path, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-folder-error', (state) => {
      state.error = result
    })
  }

  await loadFiles()
  emitFileEvent({ type: 'create', paths: [result.path] })
  await selectFile(result.path)
}

export async function deleteFolder(path: string) {
  const result = await client.folderDelete({ path })

  if (result instanceof client.Error) {
    return store.setState('delete-folder-error', (state) => {
      state.error = result
    })
  }

  closeFile()
  selectFile(undefined)
  emitFileEvent({ type: 'delete', paths: [path] })
  await loadFiles()
}

export async function moveFolder(path: string, toPath: string) {
  const result = await client.folderMove({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('move-folder-error', (state) => {
      state.error = result
    })
  }

  await loadFiles()
  emitFileEvent({ type: 'create', paths: [result.path] })
  await selectFile(result.path)
}
