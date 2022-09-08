import create from 'zustand'
import createContext from 'zustand/context'
import { client } from '../../client'
import { IResource, ITable, ITablePatch, IReport, ISession } from '../../interfaces'
import { TableProps } from './Table'

export interface TableState {
  // Data

  session?: ISession
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

  updatePatch: (tablePatch: ITablePatch) => void
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
      const { session, path } = get()
      if (!path) return
      const { resource } = await client.resourceDescribe({ session, path })
      const { table } = await client.resourceExtract({ session, resource })
      const { report } = await client.resourceValidate({ session, resource })
      set({ resource, table, report })
    },
    updatePatch: (tablePatch) => {
      set({ tablePatch })
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
