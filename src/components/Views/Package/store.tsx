import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import produce from 'immer'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import { createSelector } from 'reselect'
import { IPackage } from '../../../interfaces'
import { PackageProps } from './Package'
import * as settings from '../../../settings'

const INITIAL_PACKAGE: IPackage = { resources: [] }

interface State {
  // General (data)

  withTabs?: boolean
  descriptor: IPackage
  checkpoint: IPackage
  onCommit: (pkg: IPackage) => void
  onRevert: (pkg: IPackage) => void
  isPreview?: boolean
  isUpdated?: boolean
  exportFormat: string
  setExportFormat: (format: string) => void
  togglePreview: () => void

  // Elements (data)

  elementType: 'resource'
  elementIndex?: number
  elementQuery?: string
  isElementGrid?: boolean
  isElementExtra?: boolean

  // General (logic)

  exporter: () => void
  importer: (file: File) => void
  update: (patch: object) => void
  commit: () => void
  revert: () => void

  // Elements (logic)

  setElementType: (elementType: State['elementType']) => void
  setElementIndex: (index?: number) => void
  setElementQuery: (elementQuery?: string) => void
  toggleIsElementGrid: () => void
  toggleIsElementExtra: () => void
  addElement: () => void
  removeElement: () => void
}

export function createStore(props: PackageProps) {
  return create<State>((set, get) => ({
    // General (data)

    withTabs: props.withTabs,
    descriptor: cloneDeep(props.package || INITIAL_PACKAGE),
    checkpoint: cloneDeep(props.package || INITIAL_PACKAGE),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),

    // Elements (data)

    elementType: 'resource' as State['elementType'],

    // General (logic)

    exporter: () => {
      const { descriptor, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `datapackage.${exportFormat}`)
      set({ exportFormat: settings.DEFAULT_EXPORT_FORMAT, isPreview: false })
    },
    importer: async (file) => {
      const text = (await file.text()).trim()
      const isYaml = !text.startsWith('{')
      // TODO: handle errors and validate descriptor
      const descriptor = isYaml ? yaml.load(text) : JSON.parse(text)
      set({ descriptor, isUpdated: true })
    },
    update: (patch) => {
      const { descriptor } = get()
      set({ descriptor: { ...descriptor, ...patch }, isUpdated: true })
    },
    revert: () => {
      const { onRevert, descriptor, checkpoint } = get()
      set({ descriptor: cloneDeep(checkpoint), isUpdated: false })
      onRevert(descriptor)
    },
    commit: () => {
      const { onCommit, descriptor } = get()
      set({ checkpoint: cloneDeep(descriptor), isUpdated: false })
      onCommit(descriptor)
    },

    // Elements (logic)

    setElementType: (elementType) => set({ elementType }),
    setElementIndex: (elementIndex) => set({ elementIndex }),
    setElementQuery: (elementQuery) => set({ elementQuery }),
    toggleIsElementGrid: () => set({ isElementGrid: !get().isElementGrid }),
    toggleIsElementExtra: () => set({ isElementExtra: !get().isElementExtra }),
    // TODO: finish
    addElement: () => {
      let { elementIndex } = get()
      const { descriptor, elementType } = get()
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'resource') {
          descriptor.resources = descriptor.resources || []
          // @ts-ignore
          descriptor.resources.push({ path: 'implement.csv' })
          elementIndex = descriptor.resources.length - 1
        }
      })
      set({ descriptor: newDescriptor, elementIndex, isUpdated: true })
    },
    removeElement: () => {
      const { descriptor, elementType, elementIndex } = get()
      if (elementIndex === undefined) return
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'resource') {
          descriptor.resources!.splice(elementIndex, 1)
        }
      })
      set({ descriptor: newDescriptor, elementIndex: undefined, isUpdated: true })
    },
  }))
}

export const select = createSelector
export const selectors = {
  resource: (state: State) => {
    const elementIndex = state.elementIndex
    assert(elementIndex !== undefined)
    assert(state.descriptor.resources !== undefined)
    const resource = state.descriptor.resources[elementIndex]
    assert(resource !== undefined)
    return resource
  },
  resourceNames: (state: State) => {
    return (state.descriptor.resources || []).map((resource) => resource.name)
  },
  foundResourceItems: (state: State) => {
    const items = []
    for (const [index, resource] of (state.descriptor.resources || []).entries()) {
      if (state.elementQuery && !resource.name.includes(state.elementQuery)) continue
      items.push({ index, resource })
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
