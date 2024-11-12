import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'

// We use component level state because dialog state
// needs to be shared between multiple components
// but it is not needed in the global state
class State {
  error?: string
  action?: 'loading' | 'validating'
}

export const { state, useState } = helpers.createState('FileUpload', new State())

export function closeDialog() {
  if (!state.action) {
    appStore.closeDialog()
  }
}

export async function uploadFiles(props: { files: FileList }) {
  state.error = undefined
  state.action = 'loading'

  const paths = await appStore.uploadFiles(props.files)
  if (paths instanceof client.Error) {
    state.error = paths.detail
    state.action = undefined
    return
  }

  state.action = 'validating'
  for (const path of paths) {
    const index = await client.fileIndex({ path })
    if (index instanceof client.Error) {
      state.error = index.detail
      state.action = undefined
      return
    }
  }

  await appStore.loadFiles()
  appStore.emitEvent({ type: 'create', paths })

  for (const path of paths) {
    await appStore.selectFile({ path })
    break
  }

  appStore.openDialog('openLocation')
}

export async function uploadFolders(props: { files: FileList }) {
  appStore.addFiles(props.files)
  appStore.closeDialog()
}

export async function uploadRemoteFiles(props: { url: string }) {}
