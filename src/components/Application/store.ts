import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { ApplicationProps } from './Application'

export interface State {
  // Data

  client?: Client
  path?: string

  // Logic

  ensureClient: () => Promise<void>
  selectPath: (path?: string) => void
}

export function createStore(props: ApplicationProps) {
  return create<State>((set, get) => ({
    // Data
    ...props,

    // Logic
    ensureClient: async () => {
      if (get().client) return
      const client = await Client.connect()
      set({ client })
    },
    selectPath: (path) => {
      set({ path })
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
