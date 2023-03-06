import noop from 'lodash/noop'
import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, ITable, ITablePatch } from '../../../interfaces'
import { TableProps } from './Table'

type IPanel = 'metadata' | 'errors' | 'changes' | 'source'

export interface State {
  client: Client
  file: IFile
  tablePatch: ITablePatch
  table?: ITable
  source?: string
  selectedColumn?: number
  panel?: IPanel

  // General

  setPanel: (panel?: IPanel) => void
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
    ...props,
    tablePatch: {},

    // General

    setPanel: (panel) => set({ panel }),
    loadTable: async () => {
      const { client, file } = get()
      const { table } = await client.tableRead({ path: file.path })
      set({ table })
    },
    loadSource: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      set({ source: text })
    },
    updatePatch: (rowNumber, fieldName, value) => {
      const { tablePatch } = get()
      tablePatch[rowNumber] = { ...tablePatch[rowNumber], [fieldName]: value }
      set({ tablePatch: { ...tablePatch } })
    },
    commitPatch: async () => {
      const { client, file, tablePatch } = get()
      const { path } = await client.tableSave({ path: file.path, tablePatch })
      console.log(path)
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
