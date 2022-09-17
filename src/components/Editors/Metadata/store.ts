import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord } from '../../../interfaces'
import { MetadataProps } from './Metadata'

export interface State {
  // Data

  client: Client
  record: IRecord
  type: 'package' | 'resource' | 'dialect' | 'schema' | 'checklist' | 'pipeline'
  onPathChange?: (path?: string) => void
  descriptor?: object

  // Logic
  loadDescriptor: () => Promise<void>
}

export function createStore(props: MetadataProps) {
  return create<State>((set, get) => ({
    // Data

    ...props,

    // Logic

    loadDescriptor: async () => {
      const { client, record } = get()
      const { data } = await client.resourceReadData({ resource: record.resource })
      set({ descriptor: data })
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
