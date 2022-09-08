import create from 'zustand'
import createContext from 'zustand/context'
import { DatagridProps } from './Datagrid'
import { ITable, IReport, ITablePatch } from '../../interfaces'

interface DatagridState {
  // Data
  table: ITable
  report: IReport
  onUpdate: (patch: ITablePatch) => void
  tablePatch: ITablePatch

  // Logic

  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
}

export function makeStore(props: DatagridProps) {
  return create<DatagridState>((set, get) => ({
    // Data
    ...props,
    tablePatch: {},

    // Logic

    updatePatch: (rowNumber, fieldName, value) => {
      const { tablePatch, onUpdate } = get()
      tablePatch[rowNumber] = { ...tablePatch[rowNumber], [fieldName]: value }
      set({ tablePatch: { ...tablePatch } })
      onUpdate(tablePatch)
    },
  }))
}

export const { Provider, useStore } = createContext<DatagridState>()
