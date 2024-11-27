import { client } from '@client/client'
import { saveChangesDialog } from '@client/components/Application/Dialogs/SaveChanges'
import * as helpers from '@client/helpers'
import { cloneDeep } from 'lodash'
import invariant from 'tiny-invariant'
import * as store from '../store'
import { emitEvent, openDialog } from './app'
import { loadSource } from './source'
import { closeTable, getIsTableUpdated, openTable, revertTable } from './table'

export async function loadFiles(throwError?: boolean) {
  const result = await client.fileList()

  if (result instanceof client.Error) {
    if (throwError) throw new Error(result.detail)
    return store.setState('load-files-error', (state) => {
      state.error = result
    })
  }

  store.setState('load-files', (state) => {
    state.files = result.files
  })
}

export async function selectFile(props: { path?: string; updated?: boolean }) {
  const { path, record } = store.getState()
  if (!props.updated && path === props.path) return

  await closeFile()

  store.setState('select-file', (state) => {
    state.path = props.path
  })

  if (!props.path) return
  if (getIsFolder(store.getState())) return
  if (!props.updated && record?.path === props.path) return

  await openFile()
}

export async function selectFileWithoutOpening(props: { path?: string }) {
  const { path } = store.getState()

  if (path === props.path) return

  store.setState('select-file', (state) => {
    state.path = props.path
  })

  if (!props.path) return
}

async function openFile() {
  const { path } = store.getState()
  if (!path) return

  store.setState('open-file-start', (state) => {
    state.indexing = true
  })

  const result = await client.fileIndex({ path })
  if (result instanceof client.Error) {
    return store.setState('open-file-error', (state) => {
      state.error = result
    })
  }

  await loadFiles()

  store.setState('open-file-loaded', (state) => {
    state.record = result.record
    state.report = result.report
    state.errorIndex = helpers.createErrorIndex(result.report)
    state.errorRowNumbers = helpers.getErrorRowNumbers(result.report)
    state.resource = cloneDeep(result.record.resource)
  })

  await loadSource()

  if (result.record.type === 'table') {
    await openTable()
  }

  emitEvent({ type: 'open', paths: [path] })
  store.setState('open-file-end', (state) => {
    state.indexing = false
  })
}

async function closeFile() {
  const { record } = store.getState()
  if (!record) return

  store.setState('close-file', (state) => {
    state.record = undefined
    state.report = undefined
    state.errorIndex = undefined
    state.errorRowNumbers = undefined
    state.resource = undefined
    state.isResourceUpdated = undefined
    state.source = undefined
    state.error = undefined
    state.dialog = undefined
    state.panel = undefined
    state.indexing = false
  })

  if (record.type === 'table') {
    await closeTable()
  }
}

export async function deselectFile() {
  await selectFile({ path: undefined })
}

export async function selectMultipleFiles(paths: string[]) {
  store.setState('select-multiple-files', (state) => {
    state.selectedMultiplePaths = paths
  })
}

export async function copyFile(path: string, toPath: string) {
  const result = await client.fileCopy({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('copy-file-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function saveFile() {
  const { record } = store.getState()
  invariant(record)

  if (record.type === 'table') {
    await saveChangesDialog.saveChanges()
  }
}

export async function revertFile() {
  const { record } = store.getState()
  invariant(record)

  if (record.type === 'table') {
    await revertTable()
  }
}

export async function deleteFiles(paths: string[]) {
  for (const path of paths) {
    const result = await client.fileDelete({ path })

    if (result instanceof client.Error) {
      return store.setState('delete-files-error', (state) => {
        state.error = result
      })
    }
  }

  await onFileDeleted(paths)
}

export async function renameFile(path: string, toPath: string) {
  const result = await client.fileRename({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('move-file-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

// Handlers

export async function onFileCreated(paths: string[]) {
  await loadFiles()
  emitEvent({ type: 'create', paths })
  if (paths.length === 1) {
    const path = paths[0]
    await selectFile({ path })
  }
}

export async function onFileUpdated(paths: string[]) {
  await loadFiles()
  emitEvent({ type: 'update', paths })
  if (paths.length === 1) {
    const path = paths[0]
    await selectFile({ path, updated: true })
  }
}

export async function onFileDeleted(paths: string[]) {
  deselectFile()
  await emitEvent({ type: 'delete', paths })
  await loadFiles()
}

export function onFileLeave() {
  const isUpdated = getIsFileOrResourceUpdated(store.getState())

  if (isUpdated) {
    openDialog('unsavedChanges')
  }
}

// Selectors

export const getIsFolder = store.createSelector((state) => {
  return !!state.files.find((file) => file.path === state.path && file.type === 'folder')
})

export const getFolderPath = store.createSelector((state) => {
  if (!state.path) return undefined
  if (getIsFolder(state)) return state.path
  return helpers.getFolderPath(state.path)
})

export const getNotIndexedFiles = store.createSelector((state) => {
  return state.files.filter((file) => !file.name)
})

export const getIsFileOrResourceUpdated = store.createSelector((state) => {
  return getIsFileUpdated(state) || state.isResourceUpdated
})

export const getIsFileUpdated = store.createSelector((state) => {
  if (state.record?.type === 'table') {
    return getIsTableUpdated(state)
  } else {
    return false
  }
})
