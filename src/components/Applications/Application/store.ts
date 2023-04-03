import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { ApplicationProps } from './Application'

export interface State {
  client: Client
  file?: IFile
  fileItemAdded?: boolean

  // General

  countFiles: () => Promise<number>
  selectFile: (path?: string) => void
  setFileItemAdded: (value: boolean) => void
}

export function makeStore(props: ApplicationProps) {
  return createStore<State>((set, get) => ({
    ...props,

    // General

    countFiles: async () => {
      const { client } = get()
      const { count } = await client.fileCount()
      return count
    },
    selectFile: async (path) => {
      if (!path) return
      const { client } = get()
      const { file } = await client.fileIndex({ path })
      set({ file })
    },
    setFileItemAdded: (fileItemAdded) => {
      set({ fileItemAdded })
    },
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
