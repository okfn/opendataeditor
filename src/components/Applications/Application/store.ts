import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { ApplicationProps } from './Application'

export interface State {
  file?: IFile
  client: Client
  dialog?: 'config'
  updateState: (patch: Partial<State>) => void
  createChart: () => Promise<void>
  createView: () => Promise<void>
  saveAs: (path: string) => void
  save: () => void

  // Legacy

  selectFile: (path?: string) => void
  setFileItemAdded: (value: boolean) => void
  fileItemAdded?: boolean
}

export function makeStore(props: ApplicationProps) {
  return createStore<State>((set, get) => ({
    ...props,
    updateState: (patch) => {
      set(patch)
    },
    createChart: async () => {
      const { client, selectFile } = get()
      const path = 'new-chart.json'
      await client.jsonWrite({ path, data: {} })
      selectFile(path)
    },
    createView: async () => {
      const { client, selectFile } = get()
      const path = 'new-view.json'
      await client.jsonWrite({ path, data: { query: '' } })
      selectFile(path)
    },
    saveAs: (path) => {
      console.log('saveAs', path)
    },
    save: () => {
      console.log('save')
    },

    // Legacy

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
