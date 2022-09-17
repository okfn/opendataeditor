import noop from 'lodash/noop'
import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord, IPackage } from '../../../interfaces'
import { PackageProps } from './Package'

export interface State {
  // Data

  client: Client
  record: IRecord
  onPathChange: (path?: string) => void
  isMetadata?: boolean
  package?: IPackage
  source?: string

  // Logic

  toggleMetadata: () => void
  loadPackage: () => Promise<void>
  exportFile?: (format: string) => void
  importFile?: () => void
  updateResource?: () => void
}

export function createStore(props: PackageProps) {
  return create<State>((set, get) => ({
    // Data

    ...props,
    tablePatch: {},

    // Logic

    toggleMetadata: () => {
      set({ isMetadata: !get().isMetadata })
    },
    loadPackage: async () => {
      const { client, record } = get()
      const { data } = await client.resourceReadData({ resource: record.resource })
      set({ package: data as IPackage })
    },
    // TODO: implement
    exportFile: noop,
    importFile: noop,
    updateResource: noop,
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
