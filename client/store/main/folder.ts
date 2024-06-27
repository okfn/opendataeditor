import * as store from '../store'
import { client } from '@client/client'
import { onFileCreate, onFileDelete } from './event'

export async function copyFolder(path: string, toPath: string) {
  const result = await client.folderCopy({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('copy-folder-error', (state) => {
      state.main.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createFolder(path: string) {
  const result = await client.folderCreate({ path, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-folder-error', (state) => {
      state.main.error = result
    })
  }

  onFileCreate([result.path])
}

export async function deleteFolder(path: string) {
  const result = await client.folderDelete({ path })

  if (result instanceof client.Error) {
    return store.setState('delete-folder-error', (state) => {
      state.main.error = result
    })
  }

  onFileDelete(path)
}

export async function moveFolder(path: string, toPath: string) {
  const result = await client.folderMove({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('move-folder-error', (state) => {
      state.main.error = result
    })
  }

  onFileCreate([result.path])
}
