import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IResource } from '../../../interfaces'
import { JsonProps } from './Json'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata'
  dialog?: 'saveAs'
  revision: number
  original?: string
  modified?: string
  resource: IResource
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  saveAs: (path: string) => Promise<void>
  revert: () => void
  save: () => Promise<void>
}

export function makeStore(props: JsonProps) {
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
    loadContent: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      set({ modified: text, original: text })
    },
    saveAs: async (path) => {
      const { client, modified } = get()
      await client.textWrite({ path, text: modified! })
    },
    revert: () => {
      const { file, original } = get()
      // TODO: review case of missing record (not indexed)
      set({
        resource: cloneDeep(file.record!.resource),
        modified: original,
        revision: 0,
      })
    },
    save: async () => {
      const { file, client, modified, resource } = get()
      await client.fileUpdate({ path: file.path, resource })
      await client.textWrite({ path: file.path, text: modified! })
      // TODO: needs to udpate file object
      set({ original: modified, revision: 0 })
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