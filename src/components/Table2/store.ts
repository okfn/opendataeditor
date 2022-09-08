import create from 'zustand'
import createContext from 'zustand/context'
import { IResource, ITable2, ITablePatch, IReport } from '../../interfaces'
import { TableProps } from './Table'

type IViewType = 'table' | 'report' | 'source'

export interface TableState {
  // Data

  resource: IResource
  table: ITable2
  report?: IReport
  source?: string
  makeQuery?: (query: string) => ITable2
  updateTable?: (patch: ITablePatch) => void
  exportTable?: (format: string) => string
  updateResource?: () => void
  viewType: IViewType
  isMetadataOpen?: boolean
  tablePatch: ITablePatch

  // Logic

  setViewType: (viewType: IViewType) => void
  toggleMetadataOpen: () => void
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
  commitPatch: () => void
  revertPatch: () => void
}

export function makeStore(props: TableProps) {
  return create<TableState>((set, get) => ({
    // Data

    ...props,
    viewType: 'table' as IViewType,
    tablePatch: {},

    // Logic

    setViewType: (viewType) => {
      viewType = get().viewType !== viewType ? viewType : 'table'
      set({ viewType })
    },
    toggleMetadataOpen: () => set({ isMetadataOpen: !get().isMetadataOpen }),
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
