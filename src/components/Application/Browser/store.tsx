import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { BrowserProps } from './Browser'
import { Client } from '../../client'

interface State {
  // Data

  client: Client
  path?: string
}

export function createStore(props: BrowserProps) {
  return create<State>((_set, _get) => ({
    // Data

    ...props,
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
