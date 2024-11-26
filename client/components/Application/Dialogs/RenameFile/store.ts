import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'

class State {
  progress?: types.IProgress
}

export const { state, useState, resetState } = helpers.createState(
  'RenameFile',
  new State()
)

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}

export async function renameFile(toPath: string) {
  const isFolder = appStore.getIsFolder(appStore.getState())
  const { path } = appStore.getState()
  if (!path) return

  const target = isFolder ? 'folder' : 'file'

  state.progress = {
    type: 'renaming',
    title: `Renaming selected ${target}`,
    blocking: true,
    hidden: true,
  }

  const result = isFolder
    ? await client.folderRename({ path, toPath, deduplicate: true })
    : await client.fileRename({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    state.progress = {
      type: 'error',
      title: `Error renaming ${target}`,
      message: result.detail,
    }
  } else {
    appStore.onFileCreated([result.path])
  }

  state.progress = undefined
  closeDialog()
}
