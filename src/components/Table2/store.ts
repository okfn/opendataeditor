import create from 'zustand'
import createContext from 'zustand/context'
import { IResource, ITable2, ITablePatch, IReport } from '../../interfaces'
import { TableProps } from './Table'

type IViewType = 'table' | 'report' | 'source'

export interface TableState {
  // Data

  viewType: IViewType
  resource: IResource
  table: ITable2
  report?: IReport
  source?: string
  makeQuery?: (query: string) => ITable2
  updateTable?: (patch: ITablePatch) => void
  exportTable?: (format: string) => string
  updateResource?: () => void
  isMetadataOpen?: boolean
  isOnlyErrors?: boolean

  // Logic

  setViewType: (viewType: IViewType) => void
  toggleMetadataOpen: () => void
  toggleOnlyErrors: () => void
}

export function makeStore(props: TableProps) {
  return create<TableState>((set, get) => ({
    // Data

    viewType: 'table' as IViewType,
    ...props,

    // Logic

    setViewType: (viewType) => {
      viewType = get().viewType !== viewType ? viewType : 'table'
      set({ viewType })
    },
    toggleMetadataOpen: () => set({ isMetadataOpen: !get().isMetadataOpen }),
    toggleOnlyErrors: () => set({ isOnlyErrors: !get().isOnlyErrors }),
  }))
}

export const { Provider, useStore } = createContext<TableState>()
