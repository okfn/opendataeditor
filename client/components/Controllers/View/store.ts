import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { ViewProps } from './index'
import { ITableEditor } from '../../Editors/Table'
import * as settings from '../../../settings'
import * as types from '../../../types'

export interface State {
  updateState: (patch: Partial<State>) => void
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  dialog?: 'publish' | 'saveAs' | 'chat' | 'leave'
  panel?: 'editor' | 'metadata' | 'report' | 'source'
  columns?: types.IColumn[]
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  resource?: types.IResource
  original?: types.IView
  modified?: types.IView
  table?: types.ITable
  error?: string
  rowCount?: number
  schema?: types.ISchema
  gridRef?: React.MutableRefObject<ITableEditor>

  // General

  load: () => Promise<void>
  edit: (prompt: string) => Promise<void>
  clear: () => void
  saveAs: (toPath: string) => Promise<void>
  publish: (control: types.IControl) => Promise<string | undefined>
  revert: () => void
  save: () => Promise<void>
  onClickAway: () => void
  loader: types.ITableLoader
}

export function makeStore(props: ViewProps) {
  return createStore<State>((set, get) => ({
    ...props,
    panel: 'editor',
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
    updateState: (patch) => {
      set(patch)
    },

    // General

    load: async () => {
      const { path, client } = get()
      const { record, report, measure } = await client.fileIndex({ path })
      const { data } = await client.jsonRead({ path: record.path })
      const { columns } = await client.columnList()
      const { tableSchema } = await client.viewInfer({ path })
      const rowCount = tableSchema ? (await client.tableCount({ path })).count : undefined
      set({
        record,
        report,
        measure,
        resource: cloneDeep(record.resource),
        modified: cloneDeep(data),
        original: data,
        columns,
        schema: tableSchema,
        rowCount,
      })
    },
    edit: async (prompt) => {
      const { path, client, modified } = get()
      if (!modified) return
      const { data } = await client.viewEdit({ path, data: modified, prompt })
      set({ modified: data })
    },
    saveAs: async (toPath) => {
      const { path, client, resource, modified, onSaveAs } = get()
      await client.viewPatch({ path, toPath, data: modified, resource })
      onSaveAs(toPath)
    },
    publish: async (control) => {
      const { record, client } = get()
      const { url } = await client.filePublish({ path: record!.path, control })
      return url
    },
    revert: () => {
      const { record, original } = get()
      if (!record) return
      set({
        resource: cloneDeep(record.resource),
        modified: cloneDeep(original),
      })
    },
    save: async () => {
      const { path, client, resource, modified, onSave, load, gridRef } = get()
      const grid = gridRef?.current

      await client.viewPatch({
        path,
        data: selectors.isDataUpdated(get()) ? modified : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })
      onSave()
      await load()
      if (grid) grid.reload()
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: cloneDeep(settings.INITIAL_VIEW) })
    },
    onClickAway: () => {
      const { dialog, updateState } = get()
      const isUpdated = selectors.isUpdated(get())
      if (isUpdated && !dialog) updateState({ dialog: 'leave' })
    },
    loader: async ({ skip, limit, sortInfo }) => {
      const { path, client, rowCount } = get()
      const { rows } = await client.tableRead({
        path,
        limit,
        offset: skip,
        order: sortInfo?.name,
        desc: sortInfo?.dir === -1,
      })

      rows.forEach((row, index) => (row._rowNumber = skip + index + 1))
      return { data: rows, count: rowCount || 0 }
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return selectors.isDataUpdated(state) || selectors.isMetadataUpdated(state)
  },
  isDataUpdated: (state: State) => {
    return !isEqual(state.original, state.modified)
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
