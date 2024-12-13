import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as appStore from '@client/store'
import * as types from '@client/types'
import { t } from 'i18next'

class State {
  progress?: types.IProgress
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

export async function ingestFiles(props: { source: FileList | string }, t: any) {
  const files =
    props.source instanceof FileList
      ? await uploadLocalFiles({ source: props.source })
      : await uploadRemoteFile({ source: props.source }, t)

  if (files) {
    await validateAndSelectFiles({ files }, t)
  }
}

async function uploadLocalFiles(props: { source: FileList }) {
  state.progress = { type: 'loading', title: t('loading'), blocking: true }

  const files: IFile[] = []
  const folder = appStore.getFolderPath(appStore.getState())

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

async function uploadRemoteFile(props: { source: string }, t: any) {
  state.progress = { type: 'loading', title: t('loading'), blocking: true }

  if (!props.source) {
    state.progress = { type: 'error', message: t('error-url-blank') }
    return
  }

  if (!helpers.isUrlValid(props.source)) {
    state.progress = { type: 'error', message: t('error-url-not-valid') }
    return
  }

  const folder = appStore.getFolderPath(appStore.getState())
  const result = await client.fileFetch({ folder, url: props.source, deduplicate: true })

  if (result instanceof client.Error) {
    const message = props.source.includes('docs.google.com/spreadsheets')
      ? t('error-google-sheets-address-invalid')
      : t('error-url-not-table')
    state.progress = { type: 'error', message }
    return
  }

  state.progress = undefined
  return [result]
}

async function validateAndSelectFiles(props: { files: IFile[] }, t: any) {
  state.progress = { type: 'validating', title: t('checking-errors'), blocking: true }

  const totalSize = props.files.reduce((acc, file) => acc + file.size, 0)
  if (totalSize > 10_000_000) {
    state.progress.message = t('error-file-size-exceeds-10mb')
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
