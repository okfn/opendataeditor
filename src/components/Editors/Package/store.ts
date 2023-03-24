import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IPackage, IResource, ILicense, IHelpItem } from '../../../interfaces'
import { PackageProps } from './Package'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const INITIAL_PACKAGE: IPackage = { resources: [] }
const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'package')!

interface IPackageState {
  tabIndex: number
  vtabIndex: number
}

interface ISectionState {
  query?: string
  index?: number
  isGrid?: boolean
  isExtras?: boolean
}

interface State {
  descriptor: IPackage
  isShallow?: boolean
  onChange: (pkg: IPackage) => void
  helpItem: IHelpItem
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<IPackage>) => void

  // Package

  packageState: IPackageState
  updatePackageState: (patch: Partial<IPackageState>) => void

  // Resources

  resourceState: ISectionState & { index: number }
  updateResourceState: (patch: Partial<ISectionState>) => void
  updateResource: (patch: Partial<IResource>) => void
  removeResource: () => void
  addResource: () => void

  // Licenses

  licenseState: ISectionState
  updateLicenseState: (patch: Partial<ISectionState>) => void
  updateLicense: (patch: Partial<ILicense>) => void
  removeLicense: () => void
  addLicense: () => void
}

export function makeStore(props: PackageProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.package || cloneDeep(INITIAL_PACKAGE),
    isShallow: props.isShallow,
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

    // Package

    packageState: { tabIndex: 0, vtabIndex: 1 },
    updatePackageState: (patch) => {
      const { packageState } = get()
      set({ packageState: { ...packageState, ...patch } })
    },

    // Resources

    resourceState: { index: 0 },
    updateResourceState: (patch) => {
      const { resourceState } = get()
      set({ resourceState: { ...resourceState, ...patch } })
    },
    updateResource: (patch) => {
      const { descriptor, updateDescriptor } = get()
      const resource = selectors.resource(get())!
      const resources = descriptor.resources!
      Object.assign(resource, patch)
      updateDescriptor({ resources })
    },
    removeResource: () => {
      const { descriptor, updateDescriptor, resourceState, updateResourceState } = get()
      const index = resourceState.index!
      const resources = [...(descriptor.resources || [])]
      resources.splice(index, 1)
      updateResourceState({ index: undefined, isExtras: false })
      updateDescriptor({ resources })
    },
    // TODO: scroll to newly created resource
    addResource: () => {
      const { descriptor, updateDescriptor } = get()
      const resources = [...(descriptor.resources || [])]
      // TODO: deduplicate
      const name = `resource${resources.length}`
      resources.push({ name, type: 'table', path: 'table.csv' })
      updateDescriptor({ resources })
    },

    // Licenses

    licenseState: {},
    updateLicenseState: (patch) => {
      const { licenseState } = get()
      set({ licenseState: { ...licenseState, ...patch } })
    },
    updateLicense: (patch) => {
      const { descriptor, updateDescriptor, licenseState } = get()
      const index = licenseState.index!
      const license = selectors.license(get())
      const licenses = descriptor.licenses!
      licenses[index] = { ...license, ...patch }
      updateDescriptor({ licenses })
    },
    removeLicense: () => {
      const { descriptor, updateDescriptor, licenseState, updateLicenseState } = get()
      const index = licenseState.index!
      const licenses = [...(descriptor.licenses || [])]
      licenses.splice(index, 1)
      updateLicenseState({ index: undefined, isExtras: false })
      updateDescriptor({ licenses })
    },
    // TODO: scroll to newly created license
    addLicense: () => {
      const { descriptor, updateDescriptor } = get()
      const licenses = [...(descriptor.licenses || [])]
      licenses.push({ name: 'MIT' })
      updateDescriptor({ licenses })
    },
  }))
}

export const select = createSelector
export const selectors = {
  // Resources

  resource: (state: State) => {
    const index = state.resourceState.index
    const resources = state.descriptor.resources!
    const resource = resources[index]
    return resource
  },
  resourceItems: (state: State) => {
    const items = []
    const query = state.resourceState.query
    for (const [index, resource] of (state.descriptor.resources || []).entries()) {
      if (query && !resource.name.toLowerCase().includes(query.toLowerCase())) continue
      items.push({ index, resource })
    }
    return items
  },
  resourceNames: (state: State) => {
    return state.descriptor.resources.map((resource) => resource.name)
  },

  // Licenses

  license: (state: State) => {
    const index = state.licenseState.index!
    const licenses = state.descriptor.licenses!
    const license = licenses[index]!
    return license
  },
  licenseItems: (state: State) => {
    const items = []
    const query = state.licenseState.query
    for (const [index, license] of (state.descriptor.licenses || []).entries()) {
      if (query && !license.name.toLowerCase().includes(query.toLowerCase())) continue
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