import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'

class State {
  progress?: types.IProgress
}

export const { state, useState } = helpers.createState('DeleteFile', new State())

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}

export async function deleteFile() {
  const isFolder = appStore.getIsFolder(appStore.getState())
  const { path } = appStore.getState()
  if (!path) return

  const target = isFolder ? 'folder' : 'file'

  state.progress = {
    type: 'deleting',
    title: `Deleting selected ${target}`,
    blocking: true,
  }

  const result = isFolder
    ? await client.folderDelete({ path })
    : await client.fileDelete({ path })

  if (result instanceof client.Error) {
    state.progress = {
      type: 'error',
      title: `Error deleting the ${target}`,
      message: result.detail,
    }
  }

  state.progress = undefined
  appStore.onFileDeleted([path])
  closeDialog()
}
