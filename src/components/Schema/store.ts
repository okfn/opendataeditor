import create from 'zustand'
import produce from 'immer'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { SchemaProps } from './Schema'
import { ISchema } from '../../interfaces'
import * as settings from '../../settings'

// TODO: refactor - use slices?

interface SchemaState {
  // General

  descriptor: ISchema
  checkpoint: ISchema
  onCommit: (descriptor: ISchema) => void
  onRevert: (descriptor: ISchema) => void
  // TODO: handle all the state in previewFormat?
  isPreview?: boolean
  // TODO: use deep equality check instead of the flag
  isUpdated?: boolean
  exportFormat: string

  // Elements

  elementType: string
  elementIndex?: number
  elementQuery?: string
  isElementGrid?: boolean
  isElementExtra?: boolean
}

interface SchemaLogic {
  // General

  setExportFormat: (format: string) => void
  togglePreview: () => void
  exporter: () => void
  importer: (file: File) => void
  // TODO: type the patch
  update: (patch: object) => void
  commit: () => void
  revert: () => void
  removeField: () => void
  // TODO: type the patch
  updateField: (patch: object) => void
  addField: () => void

  // Elements

  setElementType: (elementType: string) => void
  setElementIndex: (index?: number) => void
  setElementQuery: (elementQuery: string) => void
  toggleIsElementGrid: () => void
  toggleIsElementExtra: () => void
  addElement: () => void
  removeElement: () => void
}

export function makeStore(props: SchemaProps) {
  const initialState = {
    // General

    descriptor: cloneDeep(props.descriptor),
    checkpoint: cloneDeep(props.descriptor),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,

    // Elements

    elementType: 'field',
  }
  return create<SchemaState & SchemaLogic>((set, get) => ({
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
      const { onRevert, descriptor, checkpoint } = get()
      set({ descriptor: cloneDeep(checkpoint), isUpdated: false })
      onRevert(descriptor)
    },
    commit: () => {
      const { onCommit, descriptor } = get()
      set({ checkpoint: cloneDeep(descriptor), isUpdated: false })
      onCommit(descriptor)
    },
    updateField: (patch) => {
      const { descriptor, elementIndex } = get()
      if (elementIndex === undefined) return
      const newDescriptor = produce(descriptor, (descriptor) => {
        descriptor.fields[elementIndex] = {
          ...descriptor.fields[elementIndex],
          ...patch,
        }
      })
      set({ descriptor: newDescriptor, isUpdated: true })
    },
    addField: () => {
      const { descriptor } = get()
      const newDescriptor = produce(descriptor, (descriptor) => {
        descriptor.fields.push({
          name: 'newField',
          type: 'string',
          format: 'default',
        })
      })
      const elementIndex = newDescriptor.fields.length - 1
      set({ descriptor: newDescriptor, elementIndex, isUpdated: true })
    },
    // TODO: finish
    addElement: () => {
      let { elementIndex } = get()
      const { descriptor, elementType } = get()
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'field') {
          descriptor.fields.push({ name: 'newField', type: 'string', format: 'default' })
          elementIndex = descriptor.fields.length - 1
        } else if (elementType === 'foreignKey') {
          descriptor.foreignKeys = descriptor.foreignKeys || []
          descriptor.foreignKeys.push({
            field: ['newField'],
            reference: { field: ['otherField'], resource: 'self' },
          })
          elementIndex = descriptor.foreignKeys.length - 1
        }
      })
      set({ descriptor: newDescriptor, elementIndex, isUpdated: true })
    },
    removeField: () => {
      const { descriptor, elementIndex } = get()
      if (elementIndex === undefined) return
      const newDescriptor = produce(descriptor, (descriptor) => {
        descriptor.fields.splice(elementIndex, 1)
      })
      set({
        descriptor: newDescriptor,
        elementIndex: undefined,
        isUpdated: true,
      })
    },
    removeElement: () => {
      const { descriptor, elementType, elementIndex } = get()
      if (elementIndex === undefined) return
      const newDescriptor = produce(descriptor, (descriptor) => {
        if (elementType === 'field') {
          descriptor.fields.splice(elementIndex, 1)
        } else if (elementType === 'foreignKey') {
          descriptor.foreignKeys = descriptor.foreignKeys || []
          descriptor.foreignKeys.splice(elementIndex, 1)
        }
      })
      set({ descriptor: newDescriptor, elementIndex: undefined, isUpdated: true })
    },

    // Elements

    setElementType: (elementType) => set({ elementType }),
    setElementIndex: (elementIndex) => set({ elementIndex }),
    setElementQuery: (elementQuery) => set({ elementQuery }),
    toggleIsElementGrid: () => set({ isElementGrid: !get().isElementGrid }),
    toggleIsElementExtra: () => set({ isElementExtra: !get().isElementExtra }),
  }))
}

export const { Provider, useStore } = createContext<SchemaState & SchemaLogic>()
