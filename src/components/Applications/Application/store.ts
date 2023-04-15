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
  addedPath?: string
  updateState: (patch: Partial<State>) => void
  select: (path?: string) => Promise<void>
  save: () => void
  saveAs: (path: string) => void
  createChart: () => Promise<void>
  createView: () => Promise<void>
}

export function makeStore(props: ApplicationProps) {
  return createStore<State>((set, get) => ({
    ...props,
    updateState: (patch) => {
      set(patch)
    },
    select: async (path) => {
      const { client } = get()
      const { file } = path ? await client.fileIndex({ path }) : { file: undefined }
      set({ file })
    },
    save: () => {
      const { file, select } = get()
      if (!file) return
      select(file.path)
    },
    saveAs: (path) => {
      set({ addedPath: path })
    },
    createChart: async () => {
      const { client, select } = get()
      const path = 'new-chart.json'
      await client.jsonWrite({ path, data: {} })
      select(path)
    },
    createView: async () => {
      const { client, select } = get()
      const path = 'new-view.json'
      await client.jsonWrite({ path, data: { query: '' } })
      select(path)
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
