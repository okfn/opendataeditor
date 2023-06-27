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
import * as settings from '../../../settings'
import * as types from '../../../types'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  dialog?: 'publish' | 'saveAs'
  panel?: 'metadata' | 'report' | 'source' | 'editor'
  columns?: types.IColumn[]
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  resource?: types.IResource
  original?: types.IView
  modified?: types.IView
  table?: types.ITable
  error?: string
  updateState: (patch: Partial<State>) => void

  // General

  load: () => Promise<void>
  clear: () => void
  saveAs: (toPath: string) => Promise<void>
  publish: (control: types.IControl) => Promise<string>
  revert: () => void
  save: () => Promise<void>
}

export function makeStore(props: ViewProps) {
  return createStore<State>((set, get) => ({
    ...props,
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
      set({
        record,
        report,
        measure,
        resource: cloneDeep(record.resource),
        modified: cloneDeep(data),
        original: data,
        columns,
      })
      // TODO: move to autoupdating on change (throttle)
      if (record.name) {
        const query = `select * from "${record.name}"`
        const { table } = await client.tableQuery({ query })
        set({ table })
      }
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
      const { path, client, resource, modified, onSave, load } = get()
      await client.viewPatch({
        path,
        data: selectors.isDataUpdated(get()) ? modified : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })
      onSave()
      load()
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: cloneDeep(settings.INITIAL_VIEW) })
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
