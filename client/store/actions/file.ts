import * as store from '../store'
import { client } from '@client/client'
import { cloneDeep } from 'lodash'
import { openTable, closeTable } from './table'
import { emitEvent } from './event'
import * as helpers from '@client/helpers'

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

export async function deselectFile() {
  await selectFile({ path: undefined })
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

  store.setState('open-file-end', (state) => {
    state.record = result.record
    state.report = result.report
    state.measure = result.measure
    state.resource = cloneDeep(result.record.resource)
    state.indexing = false
  })

  emitEvent({ type: 'open', paths: [path] })

  if (result.record?.type === 'table') {
    await openTable()
  }
}

async function closeFile() {
  const { record } = store.getState()

  store.setState('close-file', (state) => {
    state.record = undefined
    state.report = undefined
    state.measure = undefined
    state.resource = undefined
    state.indexing = false
  })

  if (record?.type === 'table') {
    await closeTable()
  }
}

export async function addFiles(files: FileList) {
  const folder = getFolderPath(store.getState())
  const paths: string[] = []

  for (const file of files) {
    const path = file.webkitRelativePath || undefined
    const result = await client.fileCreate({ file, path, folder, deduplicate: true })

    if (result instanceof client.Error) {
      return store.setState('add-files-error', (state) => {
        state.error = result
      })
    }

    paths.push(result.path)
  }

  await onFileCreated(paths)
}

export async function fetchFile(url: string) {
  const folder = getFolderPath(store.getState())
  const result = await client.fileFetch({ url, folder, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('fetch-file-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function adjustFile(name?: string, type?: string) {
  const { path } = store.getState()
  if (!path) return

  const result = await client.filePatch({ path, name, type })

  if (result instanceof client.Error) {
    return store.setState('adjust-file-error', (state) => {
      state.error = result
    })
  }

  store.setState('adjust-file-close', (state) => {
    state.path = undefined
  })

  await onFileUpdated([result.path])
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

export async function deleteFile(path: string) {
  const result = await client.fileDelete({ path })

  if (result instanceof client.Error) {
    return store.setState('delete-file-error', (state) => {
      state.error = result
    })
  }

  await onFileDeleted([result.path])
}

export async function moveFile(path: string, toPath: string) {
  const result = await client.fileMove({ path, toPath, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('move-file-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function locateFile(path: string) {
  store.setState('locate-file-start', (state) => {
    state.path = path
  })

  emitEvent({ type: 'locate', paths: [path] })
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
