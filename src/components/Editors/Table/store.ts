import noop from 'lodash/noop'
import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord, ITable, ITablePatch } from '../../../interfaces'
import { TableProps } from './Table'

export interface State {
  // Data

  client: Client
  record: IRecord
  isMetadata?: boolean
  tablePatch: ITablePatch
  table?: ITable
  source?: string
  selectedColumn?: number

  // Logic

  toggleMetadata: () => void
  loadTable: () => Promise<void>
  loadSource: () => Promise<void>
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
  commitPatch: () => void
  revertPatch: () => void
  exportTable?: (format: string) => void
  importTable?: () => void
  updateResource?: () => void
  updateColumn: (selectedColumn: number) => void
}

export function createStore(props: TableProps) {
  return create<State>((set, get) => ({
    // Data

    ...props,
    tablePatch: {},

    // Logic

    toggleMetadata: () => {
      set({ isMetadata: !get().isMetadata })
    },
    loadTable: async () => {
      const { client, record } = get()
      const { table } = await client.resourceExtract({ resource: record.resource })
      set({ table })
    },
    loadSource: async () => {
      const { client, record } = get()
      const { text } = await client.resourceReadText({ resource: record.resource })
      set({ source: text })
    },
    updatePatch: (rowNumber, fieldName, value) => {
      const { tablePatch } = get()
      tablePatch[rowNumber] = { ...tablePatch[rowNumber], [fieldName]: value }
      set({ tablePatch: { ...tablePatch } })
    },
    commitPatch: () => {
      const { tablePatch } = get()
      // TODO: implement server-side
      console.log(tablePatch)
      set({ tablePatch: {} })
    },
    revertPatch: () => set({ tablePatch: {} }),
    // TODO: implement
    exportTable: noop,
    importTable: noop,
    updateResource: noop,
    updateColumn: (selectedColumn) => {
      set({ selectedColumn })
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
