import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord, IReport, IResource } from '../../../interfaces'
import { FileProps } from './File'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'metadata' | 'report'
  dialog?: 'saveAs'
  record?: IRecord
  report?: IReport
  resource?: IResource
  source?: ArrayBuffer
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  revert: () => void
  save: () => void
  saveAs: (path: string) => Promise<void>
}

export function makeStore(props: FileProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { record } = await client.recordCreate({ path })
      const { report } = await client.reportRead({ id: record.id })
      const resource = cloneDeep(record.resource)
      set({ record, report, resource })
      if (!['jpg', 'png'].includes(record.resource.format || '')) return
      const { bytes } = await client.fileRead({ path: record.path })
      set({ source: bytes })
    },
    revert: () => {
      const { record } = get()
      if (!record) return
      set({ resource: cloneDeep(record.resource) })
    },
    save: async () => {
      const { client, record, resource, onSave, load } = get()
      if (!record || !resource) return
      await client.recordWrite({ id: record.id, resource })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, record, onSaveAs } = get()
      if (!record) return
      await client.fileCopy({ source: record.path, target: path })
      onSaveAs(path)
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
