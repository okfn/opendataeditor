import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import { createStore } from 'zustand/vanilla'
import { IHelpItem } from '../../../interfaces'
import { ChartProps } from './Chart'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'chart')!

interface State {
  descriptor: object
  onChange: (chart: object) => void
  helpItem: IHelpItem
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<object>) => void
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.chart || {},
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateDescriptor: (patch) => {
      const { descriptor, onChange } = get()
      Object.assign(descriptor, patch)
      onChange(descriptor)
      set({ descriptor })
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
