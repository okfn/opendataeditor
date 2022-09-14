import noop from 'lodash/noop'
import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { IResource, ITable, ITablePatch, IReport } from '../../interfaces'
import { TableProps } from './Table'

export interface State {
  // Data

  client: Client
  path: string
  resource?: IResource
  table?: ITable
  report?: IReport
  source?: string
  tablePatch: ITablePatch

  // Logic

  loadEverything: () => Promise<void>
  loadSource: () => Promise<void>
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
  commitPatch: () => void
  revertPatch: () => void
  exportTable?: (format: string) => void
  importTable?: () => void
  updateResource?: () => void
}

export function createStore(props: TableProps) {
  return create<State>((set, get) => ({
    // Data

    ...props,
    tablePatch: {},

    // Logic

    loadEverything: async () => {
      const { client, path } = get()
      if (!path) return
      const { resource } = await client.resourceDescribe({ path })
      const { table } = await client.resourceExtract({ resource })
      const { report } = await client.resourceValidate({ resource })
      set({ resource, table, report })
    },
    loadSource: async () => {
      const { client, path } = get()
      const { text } = await client.projectReadFile({ path })
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
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
