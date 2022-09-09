import create from 'zustand'
import createContext from 'zustand/context'
import { Client } from '../../client'
import { IResource, ITable, ITablePatch, IReport } from '../../interfaces'
import { TableProps } from './Table'

export interface TableState {
  // Data

  client: Client
  path: string
  resource?: IResource
  table?: ITable
  report?: IReport
  source?: string
  makeQuery?: (query: string) => ITable
  updateTable?: (patch: ITablePatch) => void
  exportTable?: (format: string) => string
  importTable?: () => void
  updateResource?: () => void
  tablePatch: ITablePatch

  // Logic

  loadEverything: () => Promise<void>
  loadSource: () => Promise<void>
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
  commitPatch: () => void
  revertPatch: () => void
}

export function makeStore(props: TableProps) {
  return create<TableState>((set, get) => ({
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
      const { updateTable, tablePatch } = get()
      if (updateTable) updateTable(tablePatch)
      set({ tablePatch: {} })
    },
    revertPatch: () => set({ tablePatch: {} }),
  }))
}

export const { Provider, useStore } = createContext<TableState>()
