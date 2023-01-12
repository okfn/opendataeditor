import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import FileSaver from 'file-saver'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord } from '../../../interfaces'
import { SourceProps } from './Source'
export interface State {
  // Data

  client: Client
  record: IRecord
  source?: string
  exportFormat: string
  isPreview?: boolean
  setExportFormat: (format: string) => void
  togglePreview: () => void

  // Logic

  loadSource: () => Promise<void>
  exporter: () => void
}

export function createStore(props: SourceProps) {
  return create<State>((set, get) => ({
    // Data

    client: props.client,
    record: props.record,
    exportFormat: 'csv',
    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),

    // Logic

    loadSource: async () => {
      const { client, record } = get()
      const { text } = await client.resourceReadText({ resource: record.resource })
      set({ source: text })
    },
    exporter: () => {
      const { source, exportFormat } = get()
      const text = source || ''
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `source.${exportFormat}`)
      set({ exportFormat, isPreview: false })
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
