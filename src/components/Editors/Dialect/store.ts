import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IDialect, ICsvControl, IHelpItem, IExcelControl } from '../../../interfaces'
import { IHtmlControl, IJsonControl, IOdsControl } from '../../../interfaces'
import { DialectProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'dialect')!

interface State {
  format?: string
  descriptor: IDialect
  onChange: (dialect: IDialect) => void
  helpItem: IHelpItem
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<IDialect>) => void

  // Csv

  updateCsv: (patch: Partial<ICsvControl>) => void

  // Excel

  updateExcel: (patch: Partial<IExcelControl>) => void

  // Html

  updateHtml: (patch: Partial<IHtmlControl>) => void

  // Json

  updateJson: (patch: Partial<IJsonControl>) => void

  // Ods

  updateOds: (patch: Partial<IOdsControl>) => void
}

export function makeStore(props: DialectProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.dialect || cloneDeep(settings.INITIAL_DIALECT),
    format: props.format,
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

    // Csv

    updateCsv: (patch) => {
      const { updateDescriptor } = get()
      const csv = selectors.csv(get())
      updateDescriptor({ csv: { ...csv, ...patch } })
    },

    // Excel

    updateExcel: (patch) => {
      const { updateDescriptor } = get()
      const excel = selectors.excel(get())
      updateDescriptor({ excel: { ...excel, ...patch } })
    },

    // Html

    updateHtml: (patch) => {
      const { updateDescriptor } = get()
      const html = selectors.html(get())
      updateDescriptor({ html: { ...html, ...patch } })
    },

    // Json

    updateJson: (patch) => {
      const { updateDescriptor } = get()
      const json = selectors.json(get())
      updateDescriptor({ json: { ...json, ...patch } })
    },

    // Ods

    updateOds: (patch) => {
      const { updateDescriptor } = get()
      const ods = selectors.ods(get())
      updateDescriptor({ ods: { ...ods, ...patch } })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Csv/Excel/Json/Html/Ods

  csv: (state: State) => {
    return state.descriptor.csv || {}
  },
  excel: (state: State) => {
    return state.descriptor.excel || {}
  },
  json: (state: State) => {
    return state.descriptor.json || {}
  },
  ods: (state: State) => {
    return state.descriptor.ods || {}
  },
  html: (state: State) => {
    return state.descriptor.html || {}
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
