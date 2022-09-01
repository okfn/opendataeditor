import create from 'zustand'
import produce from 'immer'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { PipelineProps } from './Pipeline'
import { IPipeline, ISchema } from '../../interfaces'
import * as settings from '../../settings'

// TODO: refactor - use slices?

interface PipelineState {
  // General

  descriptor: IPipeline
  steppoint: IPipeline
  schema: ISchema
  onCommit: (descriptor: IPipeline) => void
  onRevert: (descriptor: IPipeline) => void
  isPreview?: boolean
  isUpdated?: boolean
  exportFormat: string

  // Elements

  elementType: 'step'
  elementIndex?: number
  elementQuery?: string
  isElementGrid?: boolean
  isElementExtra?: boolean
}

interface PipelineLogic {
  // General

  setExportFormat: (format: string) => void
  togglePreview: () => void
  exporter: () => void
  importer: (file: File) => void
  // TODO: type the patch
  update: (patch: object) => void
  commit: () => void
  revert: () => void

  // Elements

  setElementType: (elementType: PipelineState['elementType']) => void
  setElementIndex: (index?: number) => void
  setElementQuery: (elementQuery?: string) => void
  toggleIsElementGrid: () => void
  toggleIsElementExtra: () => void
  addElement: () => void
  removeElement: () => void
  // TODO: type the patch
  updateElement: (patch: object) => void
}

export function makeStore(props: PipelineProps) {
  const initialState = {
    // General

    descriptor: cloneDeep(props.descriptor),
    steppoint: cloneDeep(props.descriptor),
    schema: props.schema,
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,

    // Elements

    elementType: 'step' as PipelineState['elementType'],
  }
  return create<PipelineState & PipelineLogic>((set, get) => ({
    ...initialState,

    // General

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
      const { onRevert, descriptor, steppoint } = get()
      set({ descriptor: cloneDeep(steppoint), isUpdated: false })
      onRevert(descriptor)
    },
    commit: () => {
      const { onCommit, descriptor } = get()
      set({ steppoint: cloneDeep(descriptor), isUpdated: false })
      onCommit(descriptor)
    },

    // Elements

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
  step: (state: PipelineState) => {
    const elementIndex = state.elementIndex
    assert(elementIndex !== undefined)
    assert(state.descriptor.steps !== undefined)
    const step = state.descriptor.steps[elementIndex]
    assert(step !== undefined)
    return step
  },
  stepNames: (state: PipelineState) => {
    return (state.descriptor.steps || []).map((step) => step.type)
  },
  foundStepItems: (state: PipelineState) => {
    const items = []
    for (const [index, step] of (state.descriptor.steps || []).entries()) {
      if (state.elementQuery && !step.type.includes(state.elementQuery)) continue
      items.push({ index, step })
    }
    return items
  },
}
export const { Provider, useStore } = createContext<PipelineState & PipelineLogic>()
