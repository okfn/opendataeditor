import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'

class State {
  progress?: types.IProgress
}

export const { state, useState, resetState } = helpers.createState(
  'CreateFolderDialog',
  new State()
)

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}

export async function createFolder(path: string) {
  state.progress = {
    type: 'creating',
    title: 'Creating a folder',
    blocking: true,
    hidden: true,
  }

  const result = await client.folderCreate({ path, deduplicate: true })

  if (result instanceof client.Error) {
    state.progress = {
      type: 'error',
      title: `Error creating a folder`,
      message: result.detail,
    }
  } else {
    appStore.onFileCreated([result.path])
  }

  state.progress = undefined
  closeDialog()
}
