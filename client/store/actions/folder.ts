import { client } from '@client/client'
import * as store from '../store'
import { onFileCreated } from './file'

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

export async function renameFolder(path: string, toPath: string) {
  const result = await client.folderRename({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('move-folder-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}
