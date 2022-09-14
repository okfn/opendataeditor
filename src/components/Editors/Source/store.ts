import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord } from '../../../interfaces'
import { SourceProps } from './Source'

export interface State {
  // Data

  client: Client
  record: IRecord
  source?: string

  // Logic

  loadSource: () => Promise<void>
}

export function createStore(props: SourceProps) {
  return create<State>((set, get) => ({
    // Data

    client: props.client,
    record: props.record,

    // Logic

    loadSource: async () => {
      const { client, record } = get()
      const { text } = await client.projectReadFile({ path: record.path })
      set({ source: text })
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
