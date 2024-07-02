import { client } from '@client/client'
import { cloneDeep } from 'lodash'
import { onFileCreate, onFileUpdate } from './event'
import { revertResource } from './resource'
import * as settings from '@client/settings'
import * as types from '@client/types'
import * as store from '../store'

export const getIsTableUpdated = store.createSelector((state) => {
  return !!state.files.find((file) => file.path === state.path && file.type === 'folder')
})

export async function openTable() {
  const { path, record } = store.getState()
  if (!path || !record) return

  // Row Count
  const result = await client.tableCount({ path })
  if (result instanceof client.Error) {
    return store.setState('open-table-error', (state) => {
      state.error = result
    })
  }

  // Text Source
  let source: string | undefined
  if (settings.TEXT_TABLE_FORMATS.includes(record.resource.format || '')) {
    const result = await client.textRead({ path, size: settings.MAX_TABLE_SOURCE_SIZE })
    if (result instanceof client.Error) {
      return store.setState('open-table-error', (state) => {
        state.error = result
      })
    }
    source = result.text
  }

  store.setState('open-table-init', (state) => {
    state.table = {
      rowCount: result.count,
      history: cloneDeep(settings.INITIAL_HISTORY),
      undoneHistory: cloneDeep(settings.INITIAL_HISTORY),
      source,
    }
  })
}

export async function editTable(prompt: string) {
  const { path, table } = store.getState()
  if (!path || !table) return

  const grid = table.gridRef?.current
  if (!grid) return

  const text = table.source || ''
  const result = await client.tableEdit({ path, text, prompt })
  if (result instanceof client.Error) {
    return store.setState('edit-table-error', (state) => {
      state.error = result
    })
  }

  await onFileUpdate(path)
  grid.reload()
}

export async function forkTable(toPath: string) {
  const { path, table, resource } = store.getState()
  if (!path || !table) return

  const result = await client.tablePatch({
    path,
    toPath,
    history: table.history,
    resource,
  })

  if (result instanceof client.Error) {
    return store.setState('fork-table-error', (state) => {
      state.error = result
    })
  }

  await onFileCreate([toPath])
}

export async function publishTable(control: types.IControl) {
  const { record } = store.getState()

  const result = await client.filePublish({ path: record!.path, control })

  if (result instanceof client.Error) {
    return store.setState('publish-table-error', (state) => {
      state.error = result
    })
  }

  store.setState('publish-table-end', (state) => {
    state.table!.publishedUrl = result.url
  })
}

export async function revertTable() {
  const state = store.getState()

  if (getIsTableUpdated(state)) {
    store.setState('revert-table', (state) => {
      state.table!.history = cloneDeep(settings.INITIAL_HISTORY)
      state.table!.undoneHistory = cloneDeep(settings.INITIAL_HISTORY)
    })

    state.table?.gridRef?.current?.reload()
  }

  revertResource()
}
