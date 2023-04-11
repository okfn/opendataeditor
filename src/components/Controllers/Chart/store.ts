import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IFieldItem, IChart } from '../../../interfaces'
import { ChartProps } from './Chart'

export interface State {
  file?: IFile
  client: Client
  fields?: IFieldItem[]
  chart?: IChart
  updateState: (patch: Partial<State>) => void
  loadFields: () => Promise<void>
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    file: props.file,
    client: props.client,
    updateState: (patch) => {
      set(patch)
    },
    loadFields: async () => {
      const { client } = get()
      const { items } = await client.fieldList()
      set({ fields: items })
    },
  }))
}

export const select = createSelector
export const selectors = {}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
