import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { FileProps } from './File'
import * as helpers from '../../../helpers'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata'
  dialog?: 'saveAs'
  content?: string
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  revert: () => void
  save: (path?: string) => Promise<void>
}

export function makeStore(props: FileProps) {
  return createStore<State>((set, get) => ({
    ...props,
    updateState: (patch) => {
      set(patch)
    },
    loadContent: async () => {
      const { client, file } = get()
      if (!['jpg', 'png'].includes(file.record?.resource.format || '')) return
      const { bytes } = await client.fileRead({ path: file.path })
      const text = helpers.bytesToBase64(bytes)
      set({ content: text })
    },
    revert: () => {
      console.log('revert')
    },
    save: async (_path) => {
      console.log('save')
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (_state: State) => {
    return false
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
