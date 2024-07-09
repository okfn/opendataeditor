import * as store from '../store'
import { client } from '@client/client'
import { onFileCreated, onFileDeleted } from './file'

export async function copyFolder(path: string, toPath: string) {
  const result = await client.folderCopy({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('copy-folder-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createFolder(path: string) {
  const result = await client.folderCreate({ path, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-folder-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function deleteFolders(paths: string[]) {
  for (const path of paths) {
    const result = await client.folderDelete({ path })

    if (result instanceof client.Error) {
      return store.setState('delete-folder-error', (state) => {
        state.error = result
      })
    }
  }

  await onFileDeleted(paths)
}

export async function moveFolder(path: string, toPath: string) {
  const result = await client.folderMove({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('move-folder-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}
