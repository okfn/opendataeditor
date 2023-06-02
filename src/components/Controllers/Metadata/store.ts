import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { MetadataProps } from './index'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'report' | 'source'
  dialog?: 'saveAs'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  original?: types.IResource | types.IDialect | types.ISchema
  modified?: types.IResource | types.IDialect | types.ISchema
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
}

export function makeStore(props: MetadataProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { record, report, measure } = await client.fileIndex({ path })
      const { data } = await client.jsonRead({ path: record.path })
      set({ record, report, measure, modified: cloneDeep(data), original: data })
    },
    clear: () => {
      const { record, updateState } = get()
      if (!record) return
      const descriptor = helpers.getInitialDescriptor(record.type)
      if (!descriptor) return
      updateState({ modified: cloneDeep(descriptor) })
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original) })
    },
    save: async () => {
      const { path, client, modified, onSave, load } = get()
      await client.jsonPatch({ path, data: modified })
      onSave()
      load()
    },
    saveAs: async (toPath) => {
      const { path, client, modified, onSaveAs } = get()
      await client.jsonPatch({ path, toPath, data: modified })
      onSaveAs(toPath)
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return !isEqual(state.original, state.modified)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
