import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ControlProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import * as types from '../../../types'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'ckan')!

interface State {
  descriptor: Partial<types.IControl>
  onChange: (control?: Partial<types.IControl>) => void
  section: string
  helpItem: types.IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<types.IControl>) => void
}

export function makeStore(props: ControlProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.control || cloneDeep(settings.INITIAL_CONTROL),
    onChange: props.onChange || noop,
    section: 'ckan',
    helpItem: DEFAULT_HELP_ITEM,
    updateState: (patch) => {
      // TODO: remove this hack
      if ('section' in patch) {
        const { descriptor } = get()
        // @ts-ignore
        Object.keys(descriptor).forEach((key) => delete descriptor[key])
        // @ts-ignore
        descriptor.type = patch.section
      }
      set({ ...patch })
    },
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateDescriptor: (patch) => {
      const { descriptor, onChange } = get()
      Object.assign(descriptor, patch)
      console.log(descriptor)
      onChange(descriptor)
      set({ descriptor })
    },
  }))
}

export const select = createSelector
export const selectors = {
  ckan: (state: State) => {
    if (state.descriptor.type === 'ckan') return state.descriptor
    return null
  },
  github: (state: State) => {
    if (state.descriptor.type === 'github') return state.descriptor
    return null
  },
  zenodo: (state: State) => {
    if (state.descriptor.type === 'zenodo') return state.descriptor
    return null
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
