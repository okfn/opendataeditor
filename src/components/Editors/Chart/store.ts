import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IHelpItem, IFieldItem, IChart } from '../../../interfaces'
import { ChartProps } from './Chart'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'chart')!

interface State {
  fields: IFieldItem[]
  descriptor: Partial<IChart>
  onChange: (chart: object) => void
  helpItem: IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    options: {},
    fields: props.fields || [],
    descriptor: props.chart || {},
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateState: (patch) => {
      const { onChange } = get()
      if (patch.descriptor) onChange(patch.descriptor)
      set({ ...patch })
    },
  }))
}

export const select = createSelector
export const selectors = {
  tables: (state: State) => {
    const tables: { [name: string]: string } = {}
    for (const field of state.fields) tables[field.tableName] = field.tablePath
    return tables
  },
  fieldNames: (state: State) => {
    return state.fields
      .filter((item) => item.tablePath === state.descriptor.data?.url)
      .map((item) => item.name)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
