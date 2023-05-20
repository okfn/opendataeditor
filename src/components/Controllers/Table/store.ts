import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord, IReport } from '../../../interfaces'
import { ITablePatch, IResource, ITableLoader, IError } from '../../../interfaces'
import { TableProps } from './Table'

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
  tableLoader: ITableLoader
  toggleErrorMode: () => Promise<void>
  error?: IError
  // TODO: Figure out how to highlight the column in datagrid without rerender
  selectedField?: string

  // Legacy

  tablePatch: ITablePatch
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    tablePatch: {},
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { record } = await client.recordCreate({ path })
      const { report } = await client.reportRead({ name: record.name })
      const resource = cloneDeep(record.resource)
      set({ record, report, resource })
      const { count } = await client.tableCount({ name: record.name })
      set({ rowCount: count })
    },
    loadSource: async () => {
      const { path, client } = get()
      const { text } = await client.textRead({ path })
      set({ source: text })
    },
    revert: () => {
      const { record } = get()
      if (!record) return
      set({ resource: cloneDeep(record.resource) })
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
    saveAs: async (path) => {
      const { record, client, onSaveAs } = get()
      if (!record) return
      await client.fileCopy({ source: record.path, target: path })
      onSaveAs(path)
    },
    tableLoader: async ({ skip, limit, sortInfo }) => {
      const { record, client, rowCount, mode } = get()
      const { rows } = await client.tableRead({
        name: record!.name,
        valid: mode === 'errors' ? false : undefined,
        limit,
        offset: skip,
        order: sortInfo?.name,
        desc: sortInfo?.dir === -1,
      })
      return {
        data: rows,
        count: rowCount || 0,
      }
    },
    toggleErrorMode: async () => {
      const { client, mode, record } = get()
      if (!record) return
      if (mode === 'errors') {
        const { count } = await client.tableCount({ name: record.name })
        set({ mode: undefined, rowCount: count })
      } else {
        const { count } = await client.tableCount({ name: record.name, valid: false })
        set({ mode: 'errors', rowCount: count })
      }
    },

    // Legacy

    updatePatch: (rowNumber, fieldName, value) => {
      const { tablePatch } = get()
      tablePatch[rowNumber] = { ...tablePatch[rowNumber], [fieldName]: value }
      set({ tablePatch: { ...tablePatch } })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
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
