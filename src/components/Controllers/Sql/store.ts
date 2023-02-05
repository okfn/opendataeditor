import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { IFile } from '../../../interfaces'
import { Client } from '../../../client'
import { ITable } from '../../../interfaces'
import { SqlProps } from './Sql'

export interface State {
  client: Client
  file: IFile
  query?: string
  table?: ITable

  // General

  setQuery: (query?: string) => void
  makeQuery: () => Promise<void>
}

export function createStore(props: SqlProps) {
  return create<State>((set, get) => ({
    client: props.client,
    file: props.file,

    // General

    setQuery: (query) => set({ query }),
    makeQuery: async () => {
      const { client, query } = get()
      if (!query) return
      const { table } = await client.projectQueryTable({ query })
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
