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
import { PipelineProps } from './Pipeline'
import { IPipeline, ISchema } from '../../interfaces'
import * as settings from '../../settings'

// TODO: refactor - use slices?

const INITIAL_PIPELINE: IPipeline = {}

interface State {
  // General (data)

  descriptor: IPipeline
  checkpoint: IPipeline
  schema?: ISchema
  onCommit: (pipeline: IPipeline) => void
  onRevert: (pipeline: IPipeline) => void
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

  elementType: 'step'
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

export function createStore(props: PipelineProps) {
  return create<State>((set, get) => ({
    // General (data)

    descriptor: cloneDeep(props.pipeline || INITIAL_PIPELINE),
    checkpoint: cloneDeep(props.pipeline || INITIAL_PIPELINE),
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
      FileSaver.saveAs(blob, `schema.${exportFormat}`)
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

    elementType: 'step' as State['elementType'],

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
        if (elementType === 'step') {
          descriptor.steps = descriptor.steps || []
          // @ts-ignore
          descriptor.steps.push({ type: 'field-add' })
          elementIndex = descriptor.steps.length - 1
        }
      })
      set({ descriptor: newDescriptor, elementIndex, isUpdated: true })
    },
    removeElement: () => {
      const { descriptor, elementType, elementIndex } = get()
      if (elementIndex === undefined) return
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'step') {
          descriptor.steps!.splice(elementIndex, 1)
        }
      })
      set({ descriptor: newDescriptor, elementIndex: undefined, isUpdated: true })
    },
    updateElement: (patch) => {
      const { descriptor, elementType, elementIndex } = get()
      assert(elementIndex !== undefined)
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'step') {
          descriptor.steps![elementIndex] = {
            ...descriptor.steps![elementIndex],
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
  step: (state: State) => {
    const elementIndex = state.elementIndex
    assert(elementIndex !== undefined)
    assert(state.descriptor.steps !== undefined)
    const step = state.descriptor.steps[elementIndex]
    assert(step !== undefined)
    return step
  },
  stepNames: (state: State) => {
    return (state.descriptor.steps || []).map((step) => step.type)
  },
  foundStepItems: (state: State) => {
    const items = []
    for (const [index, step] of (state.descriptor.steps || []).entries()) {
      if (state.elementQuery && !step.type.includes(state.elementQuery)) continue
      items.push({ index, step })
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
