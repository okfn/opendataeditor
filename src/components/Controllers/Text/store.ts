import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { TextProps } from './Text'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata'
  dialog?: 'saveAs'
  content?: string
  prevContent?: string
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  revert: () => void
  save: (path?: string) => Promise<void>
}

export function makeStore(props: TextProps) {
  return createStore<State>((set, get) => ({
    ...props,
    updateState: (patch) => {
      set(patch)
    },
    loadContent: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      set({ content: text, prevContent: text })
    },
    revert: () => {
      const { prevContent } = get()
      set({ content: prevContent })
    },
    save: async (path) => {
      const { file, client, content } = get()
      if (!content) return
      await client.textWrite({ path: path || file.path, text: content })
      set({ prevContent: content })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.content !== state.prevContent
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
