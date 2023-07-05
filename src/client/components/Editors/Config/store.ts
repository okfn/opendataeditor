import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ConfigProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import * as types from '../../../types'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'config')!

interface State {
  format?: string
  descriptor: types.IConfig
  onChange: (control?: Partial<types.IConfig>) => void
  helpItem: types.IHelpItem
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<types.IConfig>) => void
}

export function makeStore(props: ConfigProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.config || cloneDeep(settings.INITIAL_CONFIG),
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateDescriptor: (patch) => {
      const { descriptor, onChange } = get()
      Object.assign(descriptor, patch)
      onChange({ ...descriptor })
      set({ descriptor })
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
