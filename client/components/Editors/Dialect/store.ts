import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { DialectProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import * as types from '../../../types'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'dialect')!

interface State {
  format: string
  section: string
  descriptor: types.IDialect
  externalMenu?: { section: string }
  onChange: (dialect: types.IDialect) => void
  helpItem: types.IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<types.IDialect>) => void

  // Format

  updateCsv: (patch: Partial<types.ICsvControl>) => void
  updateExcel: (patch: Partial<types.IExcelControl>) => void
  updateJson: (patch: Partial<types.IJsonControl>) => void
}

export function makeStore(props: DialectProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.dialect || cloneDeep(settings.INITIAL_DIALECT),
    externalMenu: props.externalMenu,
    format: props.format || 'csv',
    section: 'dialect',
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateState: (patch) => {
      set({ ...patch })
    },
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

    // Format

    updateCsv: (patch) => {
      const { updateDescriptor } = get()
      const csv = selectors.csv(get())
      updateDescriptor({ csv: { ...csv, ...patch } })
    },

    updateExcel: (patch) => {
      const { updateDescriptor } = get()
      const excel = selectors.excel(get())
      updateDescriptor({ excel: { ...excel, ...patch } })
    },

    updateJson: (patch) => {
      const { updateDescriptor } = get()
      const json = selectors.json(get())
      updateDescriptor({ json: { ...json, ...patch } })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Format

  csv: (state: State) => {
    return state.descriptor.csv || {}
  },
  excel: (state: State) => {
    return state.descriptor.excel || {}
  },
  json: (state: State) => {
    return state.descriptor.json || {}
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
