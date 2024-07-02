import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import mapValues from 'lodash/mapValues'
import isNull from 'lodash/isNull'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client, ClientError } from '../../../client'
import { ITableEditor } from '../../Editors/Table'
import { TableProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

export interface State {
  /** Path of the file relative to the project **/
  path: string
  /** Singleton to connect to the backend **/
  client: Client
  /** Event triggered onSave, it is set as a property of the component **/
  onSave: () => void
  /** Event triggered onSaveAs, it is set as a property of the component **/
  onSaveAs: (path: string) => void
  /** Keeps track if we are displaying the full datagrid or only errors. **/
  mode?: 'errors'
  /** Error object returned by the client **/
  error?: ClientError
  /** Keeps track of the selected panel **/
  panel?: 'metadata' | 'report' | 'changes' | 'source'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  /** Stores the content of the raw file when loadSource is triggered. **/
  source?: string
  /** Number of rows of the file **/
  rowCount?: number
  resource?: types.IResource
  updateState: (patch: Partial<State>) => void

  // General
  /** Set the values required to load the component: data, errors, reports, etc **/
  load: () => Promise<void>
  /** Loads the source view of the file (Displays raw CSV file) **/
  loadSource: () => Promise<void>
  /** Edit the table using an AI prompt **/
  edit: (prompt: string) => Promise<void>
  /** Save file to another path **/
  saveAs: (toPath: string) => Promise<void>
  /** Revert all the changes done to the datagrid that were not saved to disk. **/
  revert: () => void
  /** Save the changes made to the datagrid to disk. **/
  save: () => Promise<void>
  /** Calls to frictionless-py Publish function. **/
  publish: (control: types.IControl) => Promise<string | undefined>
  /** Returns the tabular data indexed in the SQLite database. **/
  /** It will apply historyChanges if they exist. **/
  loader: types.ITableLoader
  /** Array of changes that the user made to the datagrid. Kept until saving to disk. **/
  history: types.IHistory
  undoneHistory: types.IHistory
  selection?: types.ITableSelection
  /** Used to display in the table view only rows with errors **/
  toggleErrorMode: () => Promise<void>
  gridRef?: React.MutableRefObject<ITableEditor>
  /** Removes all entries from history. Called when reverting all changes. **/
  clearHistory: () => void
  /** Handles event when user clicks outside a dialog **/
  onClickAway: () => void

  // Editing
  /** The following functions are called when the user edit values in the data grid. **/
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

      const indexResult = await client.fileIndex({ path })
      if (indexResult instanceof client.Error) return set({ error: indexResult })
      const { record, report, measure } = indexResult

      const countResult = await client.tableCount({ path })
      if (countResult instanceof client.Error) return set({ error: countResult })
      const { count } = countResult

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
      const result = await client.textRead({ path, size: settings.MAX_TABLE_SOURCE_SIZE })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      set({ source: result.text })
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

      const result = await client.tableEdit({ path, text, prompt })
      if (result instanceof client.Error) {
        return set({ error: result })
      }

      onSave()
      await load()
      grid.reload()
    },
    saveAs: async (toPath) => {
      const { path, client, history, resource, onSaveAs } = get()
      const result = await client.tablePatch({ path, toPath, history, resource })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      onSaveAs(toPath)
    },
    publish: async (control) => {
      const { record, client } = get()
      const result = await client.filePublish({ path: record!.path, control })

      if (result instanceof client.Error) {
        set({ error: result })
        return
      }

      return result.url
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

      const result = await client.tablePatch({
        path,
        history: selectors.isDataUpdated(get()) ? history : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      onSave()
      await load()
      grid.reload()
    },
    loader: async ({ skip, limit, sortInfo }) => {
      const { path, client, rowCount, mode, history } = get()

      const result = await client.tableRead({
        path,
        valid: mode === 'errors' ? false : undefined,
        limit,
        offset: skip,
        order: sortInfo?.name,
        desc: sortInfo?.dir === -1,
      })

      if (result instanceof client.Error) {
        set({ error: result })
        return { data: [], count: 0 }
      }

      // convert null fields in db to empty strings to avoid errors
      // in table representation. InovuaDataGrid complains with null values
      const rowsNotNull = []
      for (const row of result.rows) {
        rowsNotNull.push(mapValues(row, (value) => (isNull(value) ? '' : value)))
      }

      helpers.applyTableHistory(history, rowsNotNull)
      return { data: rowsNotNull, count: rowCount || 0 }
    },
    toggleErrorMode: async () => {
      const { path, client, mode, gridRef } = get()
      const grid = gridRef?.current
      if (!grid) return

      // Update mode/rowCount
      if (mode === 'errors') {
        const result = await client.tableCount({ path })

        if (result instanceof client.Error) {
          return set({ error: result })
        }

        set({ mode: undefined, rowCount: result.count })
      } else {
        const result = await client.tableCount({ path, valid: false })

        if (result instanceof client.Error) {
          return set({ error: result })
        }

        set({ mode: 'errors', rowCount: result.count })
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
      gridRef?.current?.reload()
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
    deleteMultipleCells: async (cells: object) => {
      const { gridRef, history, undoneHistory } = get()
      const grid = gridRef?.current
      if (!grid) return

      const cellChanges = []

      for (const [key] of Object.entries(cells)) {
        const row = key.substring(0, key.indexOf(','))
        const rowNumber = parseInt(row)
        const column = key.substring(key.indexOf(',') + 1, key.length)

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
