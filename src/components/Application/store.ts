import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { IRecord } from '../../interfaces'
import { ApplicationProps } from './Application'

export interface State {
  client: Client
  record?: IRecord
  isWelcome?: boolean

  // General

  selectResource: (path?: string) => void
  setIsWelcome: (value: boolean) => void
}

export function createStore(props: ApplicationProps) {
  return create<State>((set, get) => ({
    ...props,

    // General

    setIsWelcome: async (isWelcome) => set({ isWelcome }),
    selectResource: async (path) => {
      if (!path) return
      const { client } = get()
      const { record } = await client.resourceProvide({ path })
      set({ record })
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
