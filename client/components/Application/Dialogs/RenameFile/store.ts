import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'
import { t } from 'i18next'

class State {
  progress?: types.IProgress
}

export const { state, useState, resetState } = helpers.createState(
  'RenameFileDialog',
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
    title: `${t('renaming-selected')} ${target}`,
    blocking: true,
    hidden: true,
  }

  const result = isFolder
    ? await client.folderRename({ path, toPath, deduplicate: true })
    : await client.fileRename({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    state.progress = {
      type: 'error',
      title: `${t('error-renaming')} ${target}`,
      message: result.detail,
    }
    return
  }

  appStore.onFileCreated([result.path])
  state.progress = undefined
  closeDialog()
}
