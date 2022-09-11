import noop from 'lodash/noop'
import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { IResource, IReport } from '../../interfaces'
import { DatasetProps } from './Dataset'

export interface State {
  // Data

  client: Client
  path: string
  resource?: IResource
  report?: IReport
  source?: string

  // Logic

  loadEverything: () => Promise<void>
  loadSource: () => Promise<void>
  exportDataset: () => void
  importDataset: () => void
  updatePackage: () => void
}

export function createStore(props: DatasetProps) {
  return create<State>((set, get) => ({
    // Data

    ...props,
    tablePatch: {},

    // Logic

    loadEverything: async () => {
      const { client, path } = get()
      if (!path) return
      const { resource } = await client.resourceDescribe({ path })
      const { report } = await client.resourceValidate({ resource })
      set({ resource, report })
    },
    loadSource: async () => {
      const { client, path } = get()
      const { text } = await client.projectReadFile({ path })
      set({ source: text })
    },
    exportDataset: noop,
    importDataset: noop,
    updatePackage: noop,
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
