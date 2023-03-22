import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import produce from 'immer'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { ChecklistProps } from './Checklist'
import { IChecklist, ISchema } from '../../../interfaces'
import * as settings from '../../../settings'

// TODO: refactor - use slices?

const INITIAL_CHECKLIST: IChecklist = {}

interface State {
  // General (data)

  descriptor: IChecklist
  checkpoint: IChecklist
  schema?: ISchema
  onCommit: (checklist: IChecklist) => void
  onRevert: (checklist: IChecklist) => void
  isPreview?: boolean
  isUpdated?: boolean
  exportFormat: string

  // General (logic)

  setExportFormat: (format: string) => void
  togglePreview: () => void
  exporter: () => void
  importer: (file: File) => void
  // TODO: type the patch
  update: (patch: object) => void
  commit: () => void
  revert: () => void

  // Elements (data)

  elementType: 'check'
  elementIndex?: number
  elementQuery?: string
  isElementGrid?: boolean
  isElementExtra?: boolean

  // Elements (logic)

  setElementType: (elementType: State['elementType']) => void
  setElementIndex: (index?: number) => void
  setElementQuery: (elementQuery?: string) => void
  toggleIsElementGrid: () => void
  toggleIsElementExtra: () => void
  addElement: () => void
  removeElement: () => void
  // TODO: type the patch
  updateElement: (patch: object) => void
}

export function createStore(props: ChecklistProps) {
  return create<State>((set, get) => ({
    // General (data)
    descriptor: cloneDeep(props.checklist || INITIAL_CHECKLIST),
    checkpoint: cloneDeep(props.checklist || INITIAL_CHECKLIST),
    schema: props.schema,
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,

    // General (logic)

    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),
    exporter: () => {
      const { descriptor, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `checklist.${exportFormat}`)
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

    // Elements (data)

    elementType: 'check' as State['elementType'],

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
        if (elementType === 'check') {
          descriptor.checks = descriptor.checks || []
          descriptor.checks.push({ type: 'duplicate-row' })
          elementIndex = descriptor.checks.length - 1
        }
      })
      set({ descriptor: newDescriptor, elementIndex, isUpdated: true })
    },
    removeElement: () => {
      const { descriptor, elementType, elementIndex } = get()
      if (elementIndex === undefined) return
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'check') {
          descriptor.checks!.splice(elementIndex, 1)
        }
      })
      set({ descriptor: newDescriptor, elementIndex: undefined, isUpdated: true })
    },
    updateElement: (patch) => {
      const { descriptor, elementType, elementIndex } = get()
      assert(elementIndex !== undefined)
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'check') {
          descriptor.checks![elementIndex] = {
            ...descriptor.checks![elementIndex],
            ...patch,
          }
        }
      })
      set({ descriptor: newDescriptor, isUpdated: true })
    },
  }))
}

export const select = createSelector
export const selectors = {
  check: (state: State) => {
    const elementIndex = state.elementIndex
    assert(elementIndex !== undefined)
    assert(state.descriptor.checks !== undefined)
    const check = state.descriptor.checks[elementIndex]
    assert(check !== undefined)
    return check
  },
  checkNames: (state: State) => {
    return (state.descriptor.checks || []).map((check) => check.type)
  },
  foundCheckItems: (state: State) => {
    const items = []
    for (const [index, check] of (state.descriptor.checks || []).entries()) {
      if (state.elementQuery && !check.type.includes(state.elementQuery)) continue
      items.push({ index, check })
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
