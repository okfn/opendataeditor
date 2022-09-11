import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import { IDialect } from '../../interfaces'
import { DialectProps } from './Dialect'
import * as settings from '../../settings'

const INITIAL_DIALECT: IDialect = {}

interface State {
  // Data

  descriptor: IDialect
  checkpoint: IDialect
  onCommit: (dialect: IDialect) => void
  onRevert: (dialect: IDialect) => void
  isPreview?: boolean
  isUpdated?: boolean
  exportFormat: string
  setExportFormat: (format: string) => void
  togglePreview: () => void

  // Logic

  exporter: () => void
  importer: (file: File) => void
  update: (patch: object) => void
  updateCsv: (patch: object) => void
  commit: () => void
  revert: () => void
}

export function createStore(props: DialectProps) {
  return create<State>((set, get) => ({
    // Data

    descriptor: cloneDeep(props.dialect || INITIAL_DIALECT),
    checkpoint: cloneDeep(props.dialect || INITIAL_DIALECT),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),

    // Logic

    exporter: () => {
      const { descriptor, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `dialect.${exportFormat}`)
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
    updateCsv: (patch) => {
      const { descriptor } = get()
      const csv = { ...(descriptor.csv || {}), ...patch }
      set({ descriptor: { ...descriptor, csv }, isUpdated: true })
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

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
