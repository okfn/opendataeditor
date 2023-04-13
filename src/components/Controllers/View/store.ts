import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { IFile } from '../../../interfaces'
import { Client } from '../../../client'
import { IResource, IView, ITable, IFieldItem } from '../../../interfaces'
import { SqlProps } from './View'
import * as settings from '../../../settings'

export interface State {
  file: IFile
  client: Client
  fields?: IFieldItem[]
  dialog?: 'saveAs'
  panel?: 'metadata' | 'report' | 'source' | 'editor'
  original?: IView
  modified?: IView
  revision: number
  resource: IResource
  table?: ITable
  error?: string
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: (path?: string) => Promise<void>
}

export interface ExceptionError {
  message: string
}

export function makeStore(props: SqlProps) {
  return createStore<State>((set, get) => ({
    file: props.file,
    client: props.client,
    panel: 'editor',
    revision: 0,
    // TODO: review case of missing record (not indexed)
    resource: cloneDeep(props.file.record!.resource),
    updateState: (patch) => {
      const { revision } = get()
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    load: async () => {
      const { client, file } = get()
      const { items } = await client.fieldList()
      const { data } = await client.jsonRead({ path: file.path })
      set({ modified: cloneDeep(data), original: data, fields: items })
      if (file.record?.tableName) {
        const query = `select * from "${file.record?.tableName}"`
        const { table } = await client.tableQuery({ query })
        set({ table })
      }
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: cloneDeep(settings.INITIAL_VIEW) })
    },
    revert: () => {
      const { file, original } = get()
      set({
        resource: cloneDeep(file.record!.resource),
        modified: cloneDeep(original),
        revision: 0,
      })
    },
    save: async (path) => {
      const { file, client, resource, modified } = get()
      if (!modified) return
      await client.fileUpdate({ path: file.path, resource })
      await client.viewWrite({ path: path || file.path, view: modified })
      set({ modified: cloneDeep(modified), original: modified, revision: 0 })
      if (file.record?.tableName) {
        const query = `select * from "${file.record?.tableName}"`
        const { table } = await client.tableQuery({ query })
        set({ table })
      }
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.revision > 0 || state.original?.query !== state.modified?.query
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
