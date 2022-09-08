import create from 'zustand'
import createContext from 'zustand/context'
import { IResource, ITable, ITablePatch, IReport } from '../../interfaces'
import { TableProps } from './Table'

export interface TableState {
  // Data

  resource: IResource
  table: ITable
  report?: IReport
  source?: string
  makeQuery?: (query: string) => ITable
  updateTable?: (patch: ITablePatch) => void
  exportTable?: (format: string) => string
  importTable?: () => void
  updateResource?: () => void
  tablePatch: ITablePatch

  // Logic

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
