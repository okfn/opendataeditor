import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { JsonProps } from './Json'

export interface State {
  file: IFile
  client: Client
  dialog?: 'saveAs'
  content?: string
  checkpoint?: string
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  revertContent: () => void
  saveContent: (path?: string) => Promise<void>
}

export function makeStore(props: JsonProps) {
  return createStore<State>((set, get) => ({
    ...props,
    updateState: (patch) => {
      set(patch)
    },
    loadContent: async () => {
      const { client, file } = get()
      const { data } = await client.jsonRead({ path: file.path })
      const content = JSON.stringify(data, null, 2)
      set({ content: content, checkpoint: content })
    },
    revertContent: () => {
      const { checkpoint } = get()
      set({ content: checkpoint })
    },
    saveContent: async (path) => {
      const { file, client, content } = get()
      const json = JSON.parse(content!)
      await client.jsonWrite({ path: path || file.path, data: json })
      set({ checkpoint: content })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.content !== state.checkpoint
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
