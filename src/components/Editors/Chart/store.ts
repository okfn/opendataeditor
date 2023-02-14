import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { ChartProps } from './Chart'
import { IChart, ITreeItem } from '../../../interfaces'
import * as helpers from './helpers'

export interface State {
  chart: IChart
  fieldTree?: ITreeItem[]

  // General
}

export function createStore(props: ChartProps) {
  return create<State>((_set, _get) => ({
    chart: props.chart || { query: '' },
    fieldTree: props.fields ? helpers.createTreeFromFields(props.fields) : undefined,

    // General
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
