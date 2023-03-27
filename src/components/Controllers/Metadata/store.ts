import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { MetadataProps } from './Metadata'

export interface State {
  file: IFile
  client: Client
  panel?: 'preview'
  dialog?: 'saveAs'
  revision: number
  descriptor?: object
  checkpoint?: object
  updateState: (patch: Partial<State>) => void
  loadDescriptor: () => Promise<void>
  revertDescriptor: () => void
  saveDescriptor: (path?: string) => Promise<void>
}

export function makeStore(props: MetadataProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    updateState: (patch) => {
      const { revision } = get()
      if ('descriptor' in patch) patch.revision = revision + 1
      set(patch)
    },
    loadDescriptor: async () => {
      const { client, file } = get()
      const { data } = await client.jsonRead({ path: file.path })
      set({ descriptor: cloneDeep(data), checkpoint: data })
    },
    revertDescriptor: () => {
      const { checkpoint } = get()
      set({ descriptor: cloneDeep(checkpoint), revision: 0 })
    },
    saveDescriptor: async (path) => {
      const { file, client, descriptor } = get()
      await client.jsonWrite({ path: path || file.path, data: descriptor })
      set({ descriptor: cloneDeep(descriptor), checkpoint: descriptor, revision: 0 })
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
