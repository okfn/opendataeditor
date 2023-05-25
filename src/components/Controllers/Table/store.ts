import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord, IReport, ITableChange } from '../../../interfaces'
import { ITablePatch, IResource, ITableLoader, IError } from '../../../interfaces'
import { IDataGrid } from '../../Parts/DataGrid'
import { TableProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  mode?: 'errors'
  panel?: 'metadata' | 'report' | 'changes' | 'source'
  dialog?: 'saveAs' | 'error'
  record?: IRecord
  report?: IReport
  source?: string
  rowCount?: number
  resource?: IResource
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  loadSource: () => Promise<void>
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
  loader: ITableLoader
  patch: ITablePatch
  error?: IError
  toggleErrorMode: () => Promise<void>
  // TODO: Figure out how to highlight the column in datagrid without rerender
  selectedField?: string
  gridRef?: React.MutableRefObject<IDataGrid>

  // Editing

  editing?: boolean
  // TODO: find proper context type
  startEditing: (context: any) => void
  saveEditing: (context: any) => void
  stopEditing: (context: any) => void
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    patch: cloneDeep(settings.INITIAL_TABLE_PATCH),
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { record } = await client.recordRead({ path })
      const { report } = await client.reportRead({ path })
      const { count } = await client.tableCount({ path })
      const resource = cloneDeep(record.resource)
      set({ record, report, resource, rowCount: count })
    },
    loadSource: async () => {
      const { path, client } = get()
      const { text } = await client.textRead({ path })
      set({ source: text })
    },
    revert: () => {
      const { record, gridRef } = get()
      const grid = gridRef?.current
      if (!record) return
      if (!grid) return

      set({
        patch: cloneDeep(settings.INITIAL_TABLE_PATCH),
        resource: cloneDeep(record.resource),
      })
      grid.reload()
    },
    // TODO: rewrite
    save: async () => {
      // const { record, client, resource, onSave, load } = get()
      // if (!record || !resource) return
      // let reindex = false
      // if (!isEqual(resource.dialect, record.resource.dialect)) reindex = true
      // if (!isEqual(resource.schema, record.resource.schema)) reindex = true
      // await client.recordWrite({ name: record.name, resource, reindex })
      // onSave()
      const { load } = get()
      load()
    },
    saveAs: async (toPath) => {
      const { path, client, onSaveAs } = get()
      await client.fileCopy({ path, toPath })
      onSaveAs(path)
    },
    loader: async ({ skip, limit, sortInfo }) => {
      const { path, client, rowCount, mode, patch } = get()
      const { rows } = await client.tableRead({
        path,
        valid: mode === 'errors' ? false : undefined,
        limit,
        offset: skip,
        order: sortInfo?.name,
        desc: sortInfo?.dir === -1,
      })

      helpers.applyTablePatch(patch, rows)
      return { data: rows, count: rowCount || 0 }
    },
    toggleErrorMode: async () => {
      const { path, client, mode } = get()
      if (mode === 'errors') {
        const { count } = await client.tableCount({ path })
        set({ mode: undefined, rowCount: count })
      } else {
        const { count } = await client.tableCount({ path, valid: false })
        set({ mode: 'errors', rowCount: count })
      }
    },

    // Editing

    startEditing: () => {
      const { updateState } = get()
      updateState({ editing: true })
    },
    saveEditing: (context) => {
      const { gridRef, patch } = get()
      const grid = gridRef?.current
      if (!grid) return

      const rowNumber = context.rowId
      const fieldName = context.columnId
      let value = context.value
      if (context.cellProps.type === 'number') value = parseInt(value)
      const change: ITableChange = { type: 'update-cell', rowNumber, fieldName, value }
      helpers.applyTablePatch({ changes: [change] }, grid.data)
      patch.changes.push(change)
    },
    stopEditing: () => {
      const { gridRef, updateState } = get()
      const grid = gridRef?.current
      if (!grid) return

      requestAnimationFrame(() => {
        updateState({ editing: false })
        grid.focus()
      })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return (
      !!state.patch.changes.length || !isEqual(state.resource, state.record?.resource)
    )
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
