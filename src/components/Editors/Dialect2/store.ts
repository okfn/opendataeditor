import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IDialect, ICsvControl, IHelpItem } from '../../../interfaces'
import { DialectProps } from './Dialect'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const INITIAL_DIALECT: IDialect = {}
const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'dialect')!

interface State {
  dialect: IDialect
  onChange: (dialect: IDialect) => void
  helpItem: IHelpItem
  updateHelp: (path: string) => void

  // Dialect

  updateDialect: (patch: Partial<IDialect>) => void

  // Csv

  updateCsv: (patch: Partial<ICsvControl>) => void
}

export function makeStore(props: DialectProps) {
  return createStore<State>((set, get) => ({
    dialect: cloneDeep(props.dialect || INITIAL_DIALECT),
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },

    // Dialect

    updateDialect: (patch) => {
      let { dialect, onChange } = get()
      dialect = { ...dialect, ...patch }
      onChange(dialect)
      set({ dialect })
    },

    // Csv

    updateCsv: (patch) => {
      const { updateDialect } = get()
      const csv = selectors.csv(get())
      updateDialect({ csv: { ...csv, ...patch } })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Csv

  csv: (state: State) => {
    return state.dialect.csv || {}
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
