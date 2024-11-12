import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'

// We use component level state because dialog state
// needs to be shared between multiple components
// but it is not needed in the global state
class State {
  progress?: IProgress
}

type IProgress = {
  type: 'loading' | 'validating' | 'error'
  message?: string
  blocking?: boolean
}

export const { state, useState } = helpers.createState('FileUpload', new State())

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}

export function resetState() {
  const initialState = new State()
  for (const key of Object.keys(state)) {
    // @ts-ignore
    state[key] = initialState[key]
  }
}

export async function ingestFiles(props: { source: FileList | string }) {
  const paths =
    props.source instanceof FileList
      ? await uploadLocalFiles({ files: props.source })
      : await uploadRemoteFile({ url: props.source })

  if (paths) {
    await validateAndSelectFiles({ paths })
  }
}

async function uploadLocalFiles(props: { files: FileList }) {
  state.progress = { type: 'loading', blocking: true }

  const paths: string[] = []
  const folder = appStore.getFolderPath(appStore.getState())

  for (const file of props.files) {
    const path = file.webkitRelativePath
    const result = await client.fileCreate({ file, path, folder, deduplicate: true })

    if (result instanceof client.Error) {
      state.progress = { type: 'error', message: result.detail }
      return
    }

    paths.push(result.path)
  }

  state.progress = undefined
  return paths
}

async function uploadRemoteFile(props: { url: string }) {
  state.progress = { type: 'loading', blocking: true }

  if (!props.url) {
    state.progress = { type: 'error', message: 'The URL is blank' }
    return
  }

  if (!helpers.isUrlValid(props.url)) {
    state.progress = { type: 'error', message: 'The URL is not valid' }
    return
  }

  const folder = appStore.getFolderPath(appStore.getState())
  const result = await client.fileFetch({ folder, url: props.url, deduplicate: true })

  if (result instanceof client.Error) {
    const message = props.url.includes('docs.google.com/spreadsheets')
      ? 'The Google Sheets URL is not valid or the table is not publically available'
      : 'The URL is not associated with a table'
    state.progress = { type: 'error', message }
    return
  }

  state.progress = undefined
  return [result.path]
}

async function validateAndSelectFiles(props: { paths: string[] }) {
  state.progress = { type: 'validating', blocking: true }

  for (const path of props.paths) {
    const result = await client.fileIndex({ path })
    if (result instanceof client.Error) {
      state.progress = { type: 'error', message: result.detail }
      return
    }
  }

  await appStore.loadFiles()
  appStore.emitEvent({ type: 'create', paths: props.paths })

  for (const path of props.paths) {
    await appStore.selectFile({ path })
    break
  }

  state.progress = undefined
  appStore.openDialog('openLocation')
}
