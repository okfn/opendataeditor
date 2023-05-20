import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { IRecord, IReport } from '../../../interfaces'
import { Client } from '../../../client'
import { IResource, IView, ITable, IColumn } from '../../../interfaces'
import { SqlProps } from './View'
import * as settings from '../../../settings'

export interface State {
  path: string
  client: Client
  isDraft?: boolean
  onSave: () => void
  onSaveAs: (path: string) => void
  onRevert?: () => void
  dialog?: 'saveAs'
  panel?: 'metadata' | 'report' | 'source' | 'editor'
  columns?: IColumn[]
  record?: IRecord
  report?: IReport
  resource?: IResource
  original?: IView
  modified?: IView
  table?: ITable
  error?: string
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
}

export interface ExceptionError {
  message: string
}

export function makeStore(props: SqlProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
    panel: props.isDraft ? 'editor' : undefined,
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { record } = await client.recordCreate({ path })
      const { report } = await client.reportRead({ name: record.name })
      const resource = cloneDeep(record.resource)
      set({ record, report, resource })
      const { columns } = await client.columnList()
      const { data } = await client.jsonRead({ path: record.path })
      set({ modified: cloneDeep(data), original: data, columns })
      // TODO: move to autoupdating on change (throttle)
      if (record.name) {
        const query = `select * from "${record.name}"`
        const { table } = await client.tableQuery({ query })
        set({ table })
      }
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: cloneDeep(settings.INITIAL_VIEW) })
    },
    revert: () => {
      const { record, original, onRevert } = get()
      if (!record) return
      set({
        resource: cloneDeep(record.resource),
        modified: cloneDeep(original),
      })
      onRevert && onRevert()
    },
    save: async () => {
      const { record, client, resource, modified, onSave, load } = get()
      if (!record || !resource || !modified) return
      await client.recordWrite({ name: record.name, resource })
      await client.viewWrite({ path: record.path, view: modified })
      set({ modified: cloneDeep(modified), original: modified })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, modified, onSaveAs } = get()
      if (!modified) return
      // TODO: write resource as well?
      await client.viewWrite({ path, view: modified })
      onSaveAs(path)
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return (
      state.isDraft ||
      !isEqual(state.original, state.modified) ||
      !isEqual(state.resource, state.record?.resource)
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
