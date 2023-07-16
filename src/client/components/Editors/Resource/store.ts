import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ResourceProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import * as types from '../../../types'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'resource')!
const MEDIA_TYPES: { [key: string]: string } = {
  csv: 'text/csv',
  json: 'application/json',
  xls: 'application/vnd.ms-excel',
}

interface ISectionState {
  query?: string
  index?: number
  isGrid?: boolean
  isExtras?: boolean
}

interface State {
  descriptor: types.IResource
  externalMenu?: { section: string }
  section: string
  onChange: (resource: types.IResource) => void
  onBackClick?: () => void
  onFieldSelected?: (name?: string) => void
  helpItem: types.IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<types.IResource>) => void

  // Licenses

  licenseState: ISectionState
  updateLicenseState: (patch: Partial<ISectionState>) => void
  updateLicense: (patch: Partial<types.ILicense>) => void
  removeLicense: (index: number) => void
  addLicense: () => void

  // Sources

  sourceState: ISectionState
  updateSourceState: (patch: Partial<ISectionState>) => void
  updateSource: (patch: Partial<types.ISource>) => void
  removeSource: (index: number) => void
  addSource: () => void

  // Contributors

  contributorState: ISectionState
  updateContributorState: (patch: Partial<ISectionState>) => void
  updateContributor: (patch: Partial<types.IContributor>) => void
  removeContributor: (index: number) => void
  addContributor: () => void
}

export function makeStore(props: ResourceProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.resource || cloneDeep(settings.INITIAL_RESOURCE),
    externalMenu: props.externalMenu,
    section: props.resource?.type === 'table' ? 'schema/field' : 'resource',
    onChange: props.onChange || noop,
    onBackClick: props.onBackClick,
    onFieldSelected: props.onFieldSelected,
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

    // Licenses

    licenseState: {},
    updateLicenseState: (patch) => {
      const { licenseState } = get()
      set({ licenseState: { ...licenseState, ...patch } })
    },
    updateLicense: (patch) => {
      const { descriptor, licenseState, updateDescriptor } = get()
      const index = licenseState.index!
      const license = selectors.license(get())
      const licenses = descriptor.licenses!
      licenses[index] = { ...license, ...patch }
      updateDescriptor({ licenses })
    },
    removeLicense: (index) => {
      const { descriptor, updateDescriptor, updateLicenseState } = get()
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

    // Sources

    sourceState: {},
    updateSourceState: (patch) => {
      const { sourceState } = get()
      set({ sourceState: { ...sourceState, ...patch } })
    },
    updateSource: (patch) => {
      const { descriptor, sourceState, updateDescriptor } = get()
      const index = sourceState.index!
      const source = selectors.source(get())
      const sources = descriptor.sources!
      sources[index] = { ...source, ...patch }
      updateDescriptor({ sources })
    },
    removeSource: (index) => {
      const { descriptor, updateDescriptor, updateSourceState } = get()
      const sources = [...(descriptor.sources || [])]
      sources.splice(index, 1)
      updateSourceState({ index: undefined, isExtras: false })
      updateDescriptor({ sources })
    },
    // TODO: scroll to newly created source
    addSource: () => {
      const { descriptor, updateDescriptor } = get()
      const sources = [...(descriptor.sources || [])]
      sources.push({ title: helpers.generateTitle(sources, 'source') })
      updateDescriptor({ sources })
    },

    // Contributors

    contributorState: {},
    updateContributorState: (patch) => {
      const { contributorState } = get()
      set({ contributorState: { ...contributorState, ...patch } })
    },
    updateContributor: (patch) => {
      const { descriptor, contributorState, updateDescriptor } = get()
      const index = contributorState.index!
      const contributor = selectors.contributor(get())
      const contributors = descriptor.contributors!
      contributors[index] = { ...contributor, ...patch }
      updateDescriptor({ contributors })
    },
    removeContributor: (index) => {
      const { descriptor, updateDescriptor, updateContributorState } = get()
      const contributors = [...(descriptor.contributors || [])]
      contributors.splice(index, 1)
      updateContributorState({ index: undefined, isExtras: false })
      updateDescriptor({ contributors })
    },
    // TODO: scroll to newly created contributor
    addContributor: () => {
      const { descriptor, updateDescriptor } = get()
      const contributors = [...(descriptor.contributors || [])]
      contributors.push({ title: helpers.generateTitle(contributors, 'contributor') })
      updateDescriptor({ contributors })
    },
  }))
}

export const select = createSelector
export const selectors = {
  mediaType: (state: State) => {
    const format = state.descriptor.format
    let mediatype = state.descriptor.mediatype
    if (!mediatype) mediatype = format ? MEDIA_TYPES[format] : ''
    return mediatype
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

  // Sources

  source: (state: State) => {
    const index = state.sourceState.index!
    const sources = state.descriptor.sources!
    const source = sources[index]!
    return source
  },
  sourceItems: (state: State) => {
    const items = []
    const query = state.sourceState.query
    for (const [index, source] of (state.descriptor.sources || []).entries()) {
      if (query && !source.title.toLowerCase().includes(query.toLowerCase())) continue
      items.push({ index, source })
    }
    return items
  },

  // Contributors

  contributor: (state: State) => {
    const index = state.contributorState.index!
    const contributors = state.descriptor.contributors!
    const contributor = contributors[index]!
    return contributor
  },
  contributorItems: (state: State) => {
    const items = []
    const query = state.contributorState.query
    for (const [index, contributor] of (state.descriptor.contributors || []).entries()) {
      if (query && !contributor.title.toLowerCase().includes(query.toLowerCase())) {
        continue
      }
      items.push({ index, contributor })
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
