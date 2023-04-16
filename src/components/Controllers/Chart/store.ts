import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IFieldItem, IChart, IResource } from '../../../interfaces'
import { ChartProps } from './Chart'

export interface State {
  path: string
  client: Client
  isDraft?: boolean
  onSave: () => void
  onSaveAs: (path: string) => void
  onRevert?: () => void
  dialog?: 'saveAs'
  panel?: 'metadata' | 'report' | 'source' | 'editor'
  fields?: IFieldItem[]
  file?: IFile
  resource?: IResource
  original?: IChart
  modified?: IChart
  rendered?: IChart
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
}

export function makeStore(props: ChartProps) {
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
      const { file } = await client.fileIndex({ path })
      if (!file) return
      const resource = cloneDeep(file.record!.resource)
      set({ file, resource })
      const { items } = await client.fieldList()
      const { data } = await client.jsonRead({ path: file.path })
      set({ modified: cloneDeep(data), original: data, fields: items })
      // Update on changes using throttle
      const { chart } = await client.chartRender({ chart: data })
      set({ rendered: chart })
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: {} })
    },
    revert: () => {
      const { original, onRevert } = get()
      set({ modified: cloneDeep(original) })
      onRevert && onRevert()
    },
    save: async () => {
      const { file, client, resource, modified, onSave, load } = get()
      if (!file || !resource || !modified) return
      await client.fileUpdate({ path: file.path, resource })
      await client.jsonWrite({ path: file.path, data: modified })
      set({ modified: cloneDeep(modified), original: modified })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, modified, onSaveAs } = get()
      // TODO: write resource as well?
      await client.jsonWrite({ path, data: modified })
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
      !isEqual(state.resource, state.file?.record!.resource)
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
