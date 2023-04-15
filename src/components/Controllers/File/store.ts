import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IResource } from '../../../interfaces'
import { FileProps } from './File'

export interface State {
  file: IFile
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'metadata' | 'report' | 'source'
  dialog?: 'saveAs'
  revision: number
  original?: ArrayBuffer
  resource: IResource
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
      if (!['jpg', 'png'].includes(file.record?.resource.format || '')) return
      const { bytes } = await client.fileRead({ path: file.path })
      set({ original: bytes })
    },
    revert: () => {
      const { file } = get()
      // TODO: review case of missing record (not indexed)
      set({ resource: cloneDeep(file.record!.resource), revision: 0 })
    },
    save: async () => {
      const { file, client, resource, onSave } = get()
      await client.fileUpdate({ path: file.path, resource })
      set({ revision: 0 })
      onSave()
    },
    saveAs: async (path) => {
      const { client, original, onSaveAs } = get()
      // TODO: write resource as well?
      await client.fileWrite({ path, file: new File([original!], 'name') })
      onSaveAs(path)
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
