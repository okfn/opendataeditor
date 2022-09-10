import * as React from 'react'
import create from 'zustand/vanilla'
import { StoreApi } from 'zustand'
import { createContext } from 'react'
import { assert } from 'ts-essentials'

export interface State {
  name: string
}

export function createStore(props: { name?: string }) {
  return create<State>((_set, _get) => ({
    name: props.name || 'name',
  }))
}

export function getStore() {
  const store = React.useContext(StoreContext)
  assert(store)
  return store
}

const StoreContext = createContext<StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
