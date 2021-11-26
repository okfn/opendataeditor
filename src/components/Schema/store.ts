import create from 'zustand'
import produce from 'immer'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { ISchema } from '../../interfaces'
import { SchemaProps } from './Schema'
import * as settings from '../../settings'

interface SchemaState {
  page: string
  descriptor: ISchema
  checkpoint: ISchema
  onCommit: (descriptor: ISchema) => void
  onRevert: (descriptor: ISchema) => void
  // TODO: handle all the state in previewFormat?
  isPreview?: boolean
  // TODO: use deep equality check instead of the flag
  isUpdated?: boolean
  exportFormat: string
  searchQuery?: string
  selectedIndex: number
  isGridView?: boolean
}

interface SchemaLogic {
  setPage: (page: string) => void
  setSearchQuery: (searchQuery: string) => void
  setSelectedIndex: (index: number) => void
  toggleIsGridView: () => void
  removeField: () => void
  updateField: (patch: object) => void
  addField: () => void
  exporter: () => void
  importer: (file: File) => void
  preview: (format: string) => void
  update: (patch: object) => void
  commit: () => void
  revert: () => void
}

export function makeStore(props: SchemaProps) {
  const initialState = {
    page: 'fields',
    descriptor: cloneDeep(props.descriptor),
    checkpoint: cloneDeep(props.descriptor),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    selectedIndex: 0,
  }
  return create<SchemaState & SchemaLogic>((set, get) => ({
    ...initialState,
    setPage: (page) => set({ page }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    toggleIsGridView: () => set({ isGridView: !get().isGridView }),
    setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
    updateField: (patch) => {
      const { descriptor, selectedIndex } = get()
      const newDescriptor = produce(descriptor, (descriptor) => {
        descriptor.fields[selectedIndex] = {
          ...descriptor.fields[selectedIndex],
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
      const selectedIndex = newDescriptor.fields.length - 1
      set({ descriptor: newDescriptor, selectedIndex, page: 'field', isUpdated: true })
    },
    removeField: () => {
      const { descriptor, selectedIndex } = get()
      const newDescriptor = produce(descriptor, (descriptor) => {
        descriptor.fields.splice(selectedIndex, 1)
      })
      set({
        descriptor: newDescriptor,
        selectedIndex: Math.max(selectedIndex - 1, 0),
        isUpdated: true,
        page: 'fields',
      })
    },
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
    preview: (format) => {
      let { exportFormat, isPreview } = get()
      isPreview = !isPreview || exportFormat !== format
      exportFormat = isPreview ? format : settings.DEFAULT_EXPORT_FORMAT
      set({ exportFormat, isPreview })
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
  }))
}

export const { Provider, useStore } = createContext<SchemaState & SchemaLogic>()
