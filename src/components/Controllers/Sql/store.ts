import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { SqlProps } from './Sql'
import { ITable } from '../../../interfaces'

export interface State {
  client: Client
  query?: string
  table?: ITable

  // General

  setQuery: (query?: string) => void
  makeQuery: () => Promise<void>
}

export function createStore(props: SqlProps) {
  return create<State>((set, get) => ({
    client: props.client,

    // General

    setQuery: (query) => set({ query }),
    makeQuery: async () => {
      const { client, query } = get()
      if (!query) return
      const { table } = await client.resourceQuery({ query })
      set({ table })
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
