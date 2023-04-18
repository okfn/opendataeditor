import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ITableLoader } from '../../../interfaces'
import { TableProps } from './Table'
import * as helpers from './helpers'

interface State {
  loader: ITableLoader
  height?: string
  onChange?: (rowNumber: number, fieldName: string, value: any) => void
  columns: any[]
  editing?: boolean
  gridRef?: any
  updateState: (patch: Partial<State>) => void
  // Currently used only to rerender
  mode?: 'errors'
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, _get) => ({
    ...props,
    columns: helpers.createColumns(props.schema, props.report),
    gridRef: React.createRef(),
    updateState: (patch) => {
      set({ ...patch })
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
