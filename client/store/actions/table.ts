import { client } from '@client/client'
import * as helpers from '@client/helpers'
import * as settings from '@client/settings'
import * as types from '@client/types'
import { cloneDeep, isNull, mapValues } from 'lodash'
import invariant from 'tiny-invariant'
import * as store from '../store'
import { onFileCreated, onFileUpdated } from './file'
import { getRefs } from './refs'
import { revertResource } from './resource'

export async function openTable() {
  const { path, record } = store.getState()
  if (!path || !record) return

  const result = await client.tableCount({ path })
  if (result instanceof client.Error) {
    return store.setState('open-table-error', (state) => {
      state.error = result
    })
  }

  store.setState('open-table-init', (state) => {
    state.table = {
      rowCount: result.count,
      history: cloneDeep(settings.INITIAL_HISTORY),
      undoneHistory: cloneDeep(settings.INITIAL_HISTORY),
    }
  })
}

export async function closeTable() {
  store.setState('close-table', (state) => {
    state.table = undefined
  })
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

  await onFileCreated([result.path])
}

export async function publishTable(control: types.IControl) {
  const { record } = store.getState()

  const result = await client.filePublish({ path: record!.path, control })

  if (result instanceof client.Error) {
    store.setState('publish-table-error', (state) => {
      state.error = result
    })
    return undefined
  }

  store.setState('publish-table-end', (state) => {
    state.table!.publishedUrl = result.url
  })

  // TODO: remove and use from the state in UI
  return result.url
}

export async function revertTable() {
  const { grid } = getRefs()
  const state = store.getState()
  if (!grid) return

  if (getIsTableUpdated(state)) {
    store.setState('revert-table', (state) => {
      state.table!.history = cloneDeep(settings.INITIAL_HISTORY)
      state.table!.undoneHistory = cloneDeep(settings.INITIAL_HISTORY)
    })

    grid.reload()
  }

  revertResource()
}

export async function saveTable() {
  const { grid } = getRefs()
  const { path, resource, table } = store.getState()
  if (!path || !grid || !table) return

  const state = store.getState()
  const isTableUpdated = getIsTableUpdated(state)
  const isResourceUpdated = state.isResourceUpdated

  const result = await client.tablePatch({
    path,
    history: isTableUpdated ? table.history : undefined,
    resource: isResourceUpdated ? resource : undefined,
  })

  if (result instanceof client.Error) {
    return store.setState('save-table-error', (state) => {
      state.error = result
    })
  }

  await onFileUpdated([path])
  grid.reload()
}

export function setTableSelection(selection: types.ITableSelection) {
  store.setState('set-table-selection', (state) => {
    state.table!.selection = selection
  })
}

export async function toggleTableErrorMode() {
  const { grid } = getRefs()
  const { path, table } = store.getState()
  if (!path || !table || !grid) return

  // Update mode/rowCount
  if (table.mode === 'errors') {
    const result = await client.tableCount({ path })

    if (result instanceof client.Error) {
      return store.setState('toggle-table-error-mode', (state) => {
        state.error = result
      })
    }

    store.setState('toggle-table-error-mode-disable', (state) => {
      state.table!.mode = undefined
      state.table!.rowCount = result.count
    })
  } else {
    const result = await client.tableCount({ path, valid: false })

    if (result instanceof client.Error) {
      return store.setState('toggle-table-error-mode', (state) => {
        state.error = result
      })
    }

    store.setState('toggle-table-error-mode-enable', (state) => {
      state.table!.mode = 'errors'
      state.table!.rowCount = result.count
    })
  }

  if (grid.setSkip) grid.setSkip(0)
  grid.reload()
}

export function startTableEditing(context: any) {
  store.setState('start-table-editing', (state) => {
    state.table!.initialEditingValue = context.value
  })
}

export function saveTableEditing(context: any) {
  const { grid } = getRefs()
  const { table } = store.getState()
  if (!table || !grid) return

  // Don't save if not changed
  const value = context.value
  if (value === table.initialEditingValue) return

  const rowNumber = context.rowId
  const fieldName = context.columnId

  const change: types.IChange = {
    type: 'cell-update',
    rowNumber,
    fieldName,
    value,
  }

  store.setState('save-table-editing', (state) => {
    state.table!.history.changes.push(change)
    state.table!.undoneHistory.changes = []
  })

  helpers.applyTableHistory({ changes: [change] }, grid.data)
  grid.reload()
}

export function stopTableEditing() {
  const { grid } = getRefs()
  if (!grid) return

  requestAnimationFrame(() => {
    store.setState('stop-table-editing', (state) => {
      if (!state.table) return
      state.table.initialEditingValue = undefined
    })
  })

  grid.focus()
}

export function undoTableChange() {
  const { grid } = getRefs()
  if (!grid) return

  store.setState('undo-change', (state) => {
    const change = state.table!.history.changes.pop()
    if (change) state.table!.undoneHistory.changes.push(change)
  })

  grid.reload()
}

export function redoTableChange() {
  const { grid } = getRefs()
  if (!grid) return

  store.setState('redo-change', (state) => {
    const change = state.table!.undoneHistory.changes.pop()
    if (change) state.table!.history.changes.push(change)
  })

  grid.reload()
}

export async function deleteMultipleCells(cells: types.ICellSelection) {
  const { grid } = getRefs()
  const { table } = store.getState()
  if (!table || !grid) return

  // Don't add multiple cells update if no cells are selected
  if (!cells || !Object.keys(cells).length) {
    return
  }

  const cellChanges = []

  for (const [key] of Object.entries(cells)) {
    const row = key.substring(0, key.indexOf(','))
    const rowNumber = parseInt(row)
    const column = key.substring(key.indexOf(',') + 1, key.length)

    // Don't allow deleting row number
    if (column === '_rowNumber') {
      continue
    }

    cellChanges.push({ rowNumber, fieldName: column, value: '' })
  }

  // Exit if no changes
  if (!cellChanges.length) {
    return
  }

  const change: types.IChange = {
    type: 'multiple-cells-update',
    cells: cellChanges,
  }

  store.setState('delete-multiple-cells', (state) => {
    state.table!.history.changes.push(change)
    state.table!.undoneHistory.changes = []
  })

  helpers.applyTableHistory({ changes: [change] }, grid.data)
}

export async function renameColumn(props: {
  index: number
  oldName: string
  newName: string
}) {
  const { grid } = getRefs()
  const { path } = store.getState()
  invariant(grid)
  invariant(path)

  const result = await client.columnRename({ ...props, path })

  if (result instanceof client.Error) {
    return store.setState('rename-column-error', (state) => {
      state.error = result
    })
  }

  await onFileUpdated([path])
  grid.reload()
}

// Loaders

export const tableLoader: types.ITableLoader = async ({ skip, limit, sortInfo }) => {
  const defaultResult = { data: [], count: 0 }
  const { path, table, errorIndex } = store.getState()

  if (!path || !table || !errorIndex) {
    return defaultResult
  }

  const result = await client.tableRead({
    path,
    valid: table.mode === 'errors' ? false : undefined,
    limit,
    offset: skip,
    order: sortInfo?.name,
    desc: sortInfo?.dir === -1,
  })

  if (result instanceof client.Error) {
    store.setState('table-loader-error', (state) => {
      state.error = result
    })
    return defaultResult
  }

  // Create requested data frame
  // convert null fields in db to empty strings to avoid errors
  // in table representation. InovuaDataGrid complains with null values
  const data = []
  for (const row of result.rows) {
    data.push(mapValues(row, (value) => (isNull(value) ? '' : value)))
  }

  helpers.applyTableErrors(errorIndex, data)
  helpers.applyTableHistory(table.history, data)

  return { data, count: table.rowCount || 0 }
}

// Selectors

export const getIsTableOrResourceUpdated = store.createSelector((state) => {
  return getIsTableUpdated(state) || state.isResourceUpdated
})

export const getIsTableUpdated = store.createSelector((state) => {
  return !!state.table?.history.changes.length
})

export function setResourceUpdatedFalse() {
  store.setState('set-resource-update-false', (state) => {
    state.isResourceUpdated = false
  })
}
