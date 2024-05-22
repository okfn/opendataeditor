import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { ITableEditor } from '../../Editors/Table'
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
  dialog?: 'publish' | 'saveAs' | 'chat' | 'leave'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  source?: string
  rowCount?: number
  resource?: types.IResource
  updateState: (patch: Partial<State>) => void

  // General

  load: () => Promise<void>
  loadSource: () => Promise<void>
  edit: (prompt: string) => Promise<void>
  saveAs: (toPath: string) => Promise<void>
  revert: () => void
  save: () => Promise<void>
  publish: (control: types.IControl) => Promise<string | undefined>
  loader: types.ITableLoader
  history: types.IHistory
  undoneHistory: types.IHistory
  selection?: types.ITableSelection
  error?: types.IError
  toggleErrorMode: () => Promise<void>
  gridRef?: React.MutableRefObject<ITableEditor>
  clearHistory: () => void
  onClickAway: () => void

  // Editing

  initialEditingValue?: string | number
  // TODO: find proper context type
  startEditing: (context: any) => void
  saveEditing: (context: any) => void
  stopEditing: (context: any) => void
  undoChange: () => void
  redoChange: () => void
  deleteMultipleCells: (cells: object) => Promise<void>
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

    // General

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
      const { path, record, client } = get()
      if (!record) return
      if (!settings.TEXT_TABLE_FORMATS.includes(record.resource.format || '')) return
      const { text } = await client.textRead({
        path,
        size: settings.MAX_TABLE_SOURCE_SIZE,
      })
      set({ source: text })
    },
    edit: async (prompt) => {
      const { path, client, source, onSave, load, loadSource, gridRef } = get()
      const grid = gridRef?.current
      if (!grid) return

      let text = source
      if (text === undefined) {
        await loadSource()
        text = get().source || ''
      }

      await client.tableEdit({ path, text, prompt })
      onSave()
      await load()
      grid.reload()
    },
    saveAs: async (toPath) => {
      const { path, client, history, resource, onSaveAs } = get()
      await client.tablePatch({ path, toPath, history, resource })
      onSaveAs(toPath)
    },
    publish: async (control) => {
      const { record, client } = get()
      const { url } = await client.filePublish({ path: record!.path, control })
      return url
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
      const { path, client, history, load, gridRef, resource, onSave } = get()
      const grid = gridRef?.current
      if (!grid) return

      await client.tablePatch({
        path,
        history: selectors.isDataUpdated(get()) ? history : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })
      onSave()
      await load()
      grid.reload()
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
    onClickAway: () => {
      const { dialog, updateState } = get()
      const isUpdated = selectors.isUpdated(get())
      if (isUpdated && !dialog) updateState({ dialog: 'leave' })
    },

    // Editing

    startEditing: (context) => {
      const { updateState } = get()
      updateState({ initialEditingValue: context.value || '' })
    },
    saveEditing: (context) => {
      const { gridRef, history, undoneHistory, initialEditingValue } = get()
      const grid = gridRef?.current
      if (!grid) return

      // Don't save if not changed
      let value = context.value || ''
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
      gridRef?.current?.reload()
    },
    stopEditing: (payload) => {
      const { gridRef, updateState } = get()
      requestAnimationFrame(() => {
        updateState({ initialEditingValue: payload.value })
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
    deleteMultipleCells: async (cells: object) => {
      const { gridRef, history, undoneHistory } = get()
      const grid = gridRef?.current
      if (!grid) return

      const cellChanges = []

      for (const [key] of Object.entries(cells)) {
        const row = key.substring(0, key.indexOf(','))
        const rowNumber = parseInt(row)
        const column = key.substring(key.indexOf(',') + 1, key.length)
        // the row counting for the method setItemAt starts at 0 and doesn't take into consideration
        // the header row, this is why we need to substract 2 from the column here
        // await grid.setItemAt(rowNumber - 2, { [column]: '' })
        cellChanges.push({ rowNumber, fieldName: column, value: '' })
      }
      const change: types.IChange = {
        type: 'multiple-cells-update',
        cells: cellChanges,
      }
      history.changes.push(change)
      helpers.applyTableHistory({ changes: [change] }, grid.data)
      undoneHistory.changes = []
      set({ history: { ...history } })
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
