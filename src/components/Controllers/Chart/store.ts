import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IFieldItem, IChart, IResource } from '../../../interfaces'
import { ChartProps } from './Chart'

export interface State {
  file: IFile
  client: Client
  fields?: IFieldItem[]
  dialog?: 'saveAs'
  panel?: 'metadata' | 'report' | 'source' | 'editor'
  original?: IChart
  modified?: IChart
  revision: number
  resource: IResource
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: (path?: string) => Promise<void>
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    // TODO: review case of missing record (not indexed)
    resource: cloneDeep(props.file.record!.resource),
    updateState: (patch) => {
      const { revision } = get()
      if ('modified' in patch) patch.revision = revision + 1
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    load: async () => {
      const { client, file } = get()
      const { items } = await client.fieldList()
      const { data } = await client.jsonRead({ path: file.path })
      set({ modified: cloneDeep(data), original: data, fields: items })
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: {} })
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original), revision: 0 })
    },
    save: async (path) => {
      const { file, client, resource, modified } = get()
      if (!modified) return
      await client.fileUpdate({ path: file.path, resource })
      await client.jsonWrite({ path: path || file.path, data: modified })
      set({ modified: cloneDeep(modified), original: modified, revision: 0 })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.revision > 0
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
