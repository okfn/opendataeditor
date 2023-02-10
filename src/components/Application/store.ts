import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { IFile } from '../../interfaces'
import { ApplicationProps } from './Application'

export interface State {
  client: Client
  file?: IFile
  isWelcome?: boolean
  initialUpload?: boolean
  initialDataPackage?: boolean

  // General

  setIsWelcome: (isWelcome: boolean) => void
  countFiles: () => Promise<void>
  setInitialUpload: (value: boolean) => void
  setInitialDataPackage: (value: boolean) => void
  selectFile: (path?: string) => void
}

export function createStore(props: ApplicationProps) {
  return create<State>((set, get) => ({
    ...props,

    // General

    setIsWelcome: (isWelcome) => set({ isWelcome }),
    countFiles: async () => {
      const { client } = get()
      const { count } = await client.fileCount()
      if (!count) set({ isWelcome: true })
    },
    selectFile: async (path) => {
      if (!path) return
      const { client } = get()
      const { file } = await client.fileIndex({ path })
      set({ file })
    },
    setInitialUpload: (initialUpload) => {
      set({ initialUpload })
    },
    setInitialDataPackage: (initialDataPackage) => {
      set({ initialDataPackage })
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
