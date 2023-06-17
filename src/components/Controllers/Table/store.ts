import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IDataGrid } from '../../Parts/DataGrid'
import { TableProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  mode?: 'errors'
  panel?: 'metadata' | 'report' | 'changes' | 'source'
  dialog?: 'saveAs'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  source?: string
  rowCount?: number
  resource?: types.IResource
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  loadSource: () => Promise<void>
  revert: () => void
  save: () => Promise<void>
  saveAs: (toPath: string) => Promise<void>
  loader: types.ITableLoader
  history: types.IHistory
  undoneHistory: types.IHistory
  selection?: types.ITableSelection
  error?: types.IError
  toggleErrorMode: () => Promise<void>
  gridRef?: React.MutableRefObject<IDataGrid>
  clearHistory: () => void

  // Editing

  initialEditingValue?: any
  // TODO: find proper context type
  startEditing: (context: any) => void
  saveEditing: (context: any) => void
  stopEditing: (context: any) => void
  undoChange: () => void
  redoChange: () => void
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    history: cloneDeep(settings.INITIAL_HISTORY),
    undoneHistory: cloneDeep(settings.INITIAL_HISTORY),
    updateState: (patch) => {
      if ('panel' in patch) patch.selection = undefined
      set(patch)
    },
    load: async () => {
      const { path, client, clearHistory } = get()
      const { record, report, measure } = await client.fileIndex({ path })
      const { count } = await client.tableCount({ path })
      set({
        record,
        report,
        measure,
        resource: cloneDeep(record.resource),
        rowCount: count,
      })
      clearHistory()
    },
    loadSource: async () => {
      const { path, client } = get()
      const { text } = await client.textRead({ path })
      set({ source: text })
    },
    revert: () => {
      const { record, gridRef, clearHistory } = get()
      if (!record) return
      if (selectors.isDataUpdated(get())) {
        clearHistory()
        gridRef?.current?.reload()
      }
      if (selectors.isMetadataUpdated(get())) {
        set({ resource: cloneDeep(record.resource) })
      }
    },
    save: async () => {
      const { path, client, history, load, resource, onSave } = get()
      await client.tablePatch({
        path,
        history: selectors.isDataUpdated(get()) ? history : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })
      onSave()
      load()
    },
    saveAs: async (toPath) => {
      const { path, client, history, resource, onSaveAs } = get()
      await client.tablePatch({ path, toPath, history, resource })
      onSaveAs(toPath)
    },
    loader: async ({ skip, limit, sortInfo }) => {
      const { path, client, rowCount, mode, history } = get()
      const { rows } = await client.tableRead({
        path,
        valid: mode === 'errors' ? false : undefined,
        limit,
        offset: skip,
        order: sortInfo?.name,
        desc: sortInfo?.dir === -1,
      })

      helpers.applyTableHistory(history, rows)
      return { data: rows, count: rowCount || 0 }
    },
    toggleErrorMode: async () => {
      const { path, client, mode, gridRef } = get()
      const grid = gridRef?.current
      if (!grid) return

      // Update mode/rowCount
      if (mode === 'errors') {
        const { count } = await client.tableCount({ path })
        set({ mode: undefined, rowCount: count })
      } else {
        const { count } = await client.tableCount({ path, valid: false })
        set({ mode: 'errors', rowCount: count })
      }

      if (grid.setSkip) grid.setSkip(0)
      grid.reload()
    },
    clearHistory: () => {
      set({
        history: cloneDeep(settings.INITIAL_HISTORY),
        undoneHistory: cloneDeep(settings.INITIAL_HISTORY),
      })
    },

    // Editing

    startEditing: (context) => {
      const { updateState } = get()
      updateState({ initialEditingValue: context.value })
    },
    saveEditing: (context) => {
      const { gridRef, history, undoneHistory, initialEditingValue } = get()
      const grid = gridRef?.current
      if (!grid) return

      // Don't save if not changed
      let value = context.value
      if (value === initialEditingValue) return

      const rowNumber = context.rowId
      const fieldName = context.columnId
      if (context.cellProps.type === 'number') value = parseInt(value)
      const change: types.IChange = {
        type: 'cell-update',
        rowNumber,
        fieldName,
        value,
      }
      helpers.applyTableHistory({ changes: [change] }, grid.data)
      history.changes.push(change)
      undoneHistory.changes = []
      set({ history: { ...history } })
    },
    stopEditing: () => {
      const { gridRef, updateState } = get()
      requestAnimationFrame(() => {
        updateState({ initialEditingValue: undefined })
        gridRef?.current?.focus()
      })
    },
    undoChange: () => {
      const { history, undoneHistory, gridRef } = get()
      const change = history.changes.pop()
      if (change) undoneHistory.changes.push(change)
      set({ history: { ...history } })
      gridRef?.current?.reload()
    },
    redoChange: () => {
      const { history, undoneHistory, gridRef } = get()
      const change = undoneHistory.changes.pop()
      if (change) history.changes.push(change)
      set({ history: { ...history } })
      gridRef?.current?.reload()
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return selectors.isDataUpdated(state) || selectors.isMetadataUpdated(state)
  },
  isDataUpdated: (state: State) => {
    return !!state.history.changes.length
  },
  isMetadataUpdated: (state: State) => {
    return !isEqual(state.resource, state.record?.resource)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
