import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord } from '../../../interfaces'
import { ReportProps } from './Report'
import * as settings from '../../../settings'

export interface State {
  // Data

  client: Client
  record: IRecord
  exportFormat: string
  isPreview?: boolean
  setExportFormat: (format: string) => void
  togglePreview: () => void

  // Logic

  exporter: () => void
}

export function createStore(props: ReportProps) {
  return create<State>((set, get) => ({
    // Data

    client: props.client,
    record: props.record,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),

    // Logic

    exporter: () => {
      const { record, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(record) : JSON.stringify(record, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `report.${exportFormat}`)
      set({ exportFormat: settings.DEFAULT_EXPORT_FORMAT, isPreview: false })
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
