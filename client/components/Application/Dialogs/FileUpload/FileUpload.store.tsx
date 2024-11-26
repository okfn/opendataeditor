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
  title?: string
  message?: string
  blocking?: boolean
}

type IFile = {
  path: string
  size: number
}

export const { state, useState, resetState } = helpers.createState(
  'FileUploadDialog',
  new State()
)

export function closeDialog() {
  if (!state.progress?.blocking) {
    appStore.closeDialog()
  }
}

export async function ingestFiles(props: { source: FileList | string }) {
  const files =
    props.source instanceof FileList
      ? await uploadLocalFiles({ source: props.source })
      : await uploadRemoteFile({ source: props.source })

  if (files) {
    await validateAndSelectFiles({ files })
  }
}

async function uploadLocalFiles(props: { source: FileList }) {
  state.progress = { type: 'loading', blocking: true }

  const files: IFile[] = []
  const folder = appStore.getFolderPath(appStore.getState())

  // @ts-ignore
  for (const file of props.source) {
    const path = file.webkitRelativePath
    const result = await client.fileCreate({ file, path, folder, deduplicate: true })

    if (result instanceof client.Error) {
      state.progress = { type: 'error', message: result.detail }
      return
    }

    files.push(result)
  }

  state.progress = undefined
  return files
}

async function uploadRemoteFile(props: { source: string }) {
  state.progress = { type: 'loading', blocking: true }

  if (!props.source) {
    state.progress = { type: 'error', message: 'The URL is blank' }
    return
  }

  if (!helpers.isUrlValid(props.source)) {
    state.progress = { type: 'error', message: 'The URL is not valid' }
    return
  }

  const folder = appStore.getFolderPath(appStore.getState())
  const result = await client.fileFetch({ folder, url: props.source, deduplicate: true })

  if (result instanceof client.Error) {
    const message = props.source.includes('docs.google.com/spreadsheets')
      ? 'The Google Sheets URL is not valid or the table is not publically available'
      : 'The URL is not associated with a table'
    state.progress = { type: 'error', message }
    return
  }

  state.progress = undefined
  return [result]
}

async function validateAndSelectFiles(props: { files: IFile[] }) {
  state.progress = { type: 'validating', title: 'Checking errors', blocking: true }

  const totalSize = props.files.reduce((acc, file) => acc + file.size, 0)
  if (totalSize > 10_000_000) {
    state.progress.message =
      'The total size of the files exceeds 10MB. This operation might take some time...'
  }

  for (const file of props.files) {
    const result = await client.fileIndex({ path: file.path })
    if (result instanceof client.Error) {
      state.progress = { type: 'error', message: result.detail }
      return
    }
  }

  await appStore.loadFiles()
  appStore.emitEvent({
    type: 'create',
    paths: props.files.map((file) => file.path),
  })

  for (const file of props.files) {
    await appStore.selectFile({ path: file.path })
    break
  }

  state.progress = undefined
  appStore.openDialog('openLocation')
}
