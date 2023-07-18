import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { PortalProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import * as types from '../../../types'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'ckan')!

interface State {
  descriptor: types.IPortal
  onChange: (descriptor?: types.IPortal) => void
  section: string
  helpItem: types.IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<types.IPortal>) => void

  // Config

  updateCkan: (patch: types.ICkanConfig) => void
  updateGithub: (patch: types.IGithubConfig) => void
  updateZenodo: (patch: types.IZenodoConfig) => void
}

export function makeStore(props: PortalProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.portal || cloneDeep(settings.INITIAL_PORTAL),
    onChange: props.onChange || noop,
    section: 'ckan',
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

    // Config

    updateCkan: (patch) => {
      const { descriptor, updateDescriptor } = get()
      descriptor.ckan = descriptor.ckan || {}
      Object.assign(descriptor.ckan, patch)
      updateDescriptor(descriptor)
    },

    updateGithub: (patch) => {
      const { descriptor, updateDescriptor } = get()
      descriptor.github = descriptor.github || {}
      Object.assign(descriptor.github, patch)
      updateDescriptor(descriptor)
    },

    updateZenodo: (patch) => {
      const { descriptor, updateDescriptor } = get()
      descriptor.zenodo = descriptor.zenodo || {}
      Object.assign(descriptor.zenodo, patch)
      updateDescriptor(descriptor)
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
