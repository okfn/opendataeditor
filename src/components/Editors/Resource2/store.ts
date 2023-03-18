import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IResource, ILicense, IHelpItem } from '../../../interfaces'
import { ResourceProps } from './Resource'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const INITIAL_RESOURCE: IResource = { name: 'name', type: 'table', path: 'path' }
const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'resource')!

interface ISectionState {
  query?: string
  index?: number
  isGrid?: boolean
  isExtras?: boolean
}

interface State {
  resource: IResource
  onChange: (resource: IResource) => void
  helpItem: IHelpItem
  updateHelp: (path: string) => void

  // Resource

  updateResource: (patch: Partial<IResource>) => void

  // Licenses

  licenseState: ISectionState
  updateLicenseState: (patch: Partial<ISectionState>) => void
  updateLicense: (patch: Partial<ILicense>) => void
  removeLicense: () => void
  addLicense: () => void
}

export function makeStore(props: ResourceProps) {
  return createStore<State>((set, get) => ({
    resource: cloneDeep(props.resource || INITIAL_RESOURCE),
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },

    // Resource

    updateResource: (patch) => {
      let { resource, onChange } = get()
      resource = { ...resource, ...patch }
      onChange(resource)
      set({ resource })
    },

    // licenses

    licenseState: {},
    updateLicenseState: (patch) => {
      const { licenseState } = get()
      set({ licenseState: { ...licenseState, ...patch } })
    },
    updateLicense: (patch) => {
      const { resource, updateResource } = get()
      const { index, license } = selectors.license(get())
      const licenses = resource.licenses!
      licenses[index] = { ...license, ...patch }
      updateResource({ licenses })
    },
    removeLicense: () => {
      const { resource, updateResource, updateLicenseState } = get()
      const { index } = selectors.license(get())
      const licenses = [...(resource.licenses || [])]
      licenses.splice(index, 1)
      updateLicenseState({ index: undefined, isExtras: false })
      updateResource({ licenses })
    },
    // TODO: scroll to newly created license
    addLicense: () => {
      const { resource, updateResource } = get()
      const licenses = [...(resource.licenses || [])]
      licenses.push({ name: 'MIT' })
      updateResource({ licenses })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Licenses

  license: (state: State) => {
    const index = state.licenseState.index!
    const licenses = state.resource.licenses!
    const license = licenses[index]!
    return { index, license }
  },
  licenseNames: (state: State) => {
    return (state.resource.licenses || []).map((license) => license.name)
  },
  foundlicenseItems: (state: State) => {
    const items = []
    const query = state.licenseState.query
    for (const [index, license] of (state.resource.licenses || []).entries()) {
      if (query && !license.name.includes(query)) continue
      items.push({ index, license })
    }
    return items
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
