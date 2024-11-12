import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'

// We use component level state because dialog state
// needs to be shared between multiple components
// but it is not needed in the global state
class State {
  error?: string
  action?: 'loading' | 'validating'
  message?: string
  remoteUrl?: string
}

export const { state, useState } = helpers.createState('FileUpload', new State())

export function resetState() {
  const initialState = new State()
  for (const key of Object.keys(state)) {
    // @ts-ignore
    state[key] = initialState[key]
  }
}

export function closeDialog() {
  if (!state.action) {
    appStore.closeDialog()
  }
}

export function setRemoteUrl(value: string) {
  state.remoteUrl = value
  state.error = undefined
}

export async function uploadLocalFiles(props: { files: FileList }) {
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

  state.action = undefined
  state.remoteUrl = undefined
  appStore.openDialog('openLocation')
}

export async function uploadRemoteFile() {
  const url = state.remoteUrl

  if (!url) {
    state.error = 'The URL is blank'
    return
  }

  if (!helpers.isUrlValid(url)) {
    state.error = 'The URL is not valid'
    return
  }

  state.action = 'loading'
  const path = await appStore.fetchFile({ url })
  if (path instanceof client.Error) {
    if (url.includes('docs.google.com/spreadsheets')) {
      state.error =
        'The Google Sheets URL is not valid or the table is not publically available'
    } else {
      state.error = 'The URL is not associated with a table'
    }

    state.action = undefined
    return
  }

  state.action = 'validating'
  const index = await client.fileIndex({ path })
  if (index instanceof client.Error) {
    state.error = index.detail
    state.action = undefined
    return
  }

  await appStore.loadFiles()
  appStore.emitEvent({ type: 'create', paths: [path] })
  await appStore.selectFile({ path })

  state.action = undefined
  appStore.openDialog('openLocation')
}
