import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { TextProps } from './Text'

export interface State {
  client: Client
  file: IFile
  language?: string
  dialog?: 'saveAs'
  content?: string
  checkpoint?: string
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  revertContent: () => void
  saveContent: (path?: string) => Promise<void>
  setLanguage: (language: string) => void
}

export function makeStore(props: TextProps) {
  return createStore<State>((set, get) => ({
    ...props,
    language: 'plaintext',
    newFile: undefined,
    setLanguage: (language: string) => set({ language }),
    updateState: (patch) => {
      set(patch)
    },
    loadContent: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      set({ content: text, checkpoint: text })
    },
    revertContent: () => {
      const { checkpoint } = get()
      set({ content: checkpoint })
    },
    saveContent: async (path) => {
      const { file, client, content } = get()
      if (!content) return
      await client.textWrite({ path: path || file.path, text: content })
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
