import create from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { IReport, ITable } from '../../interfaces'
import { ISchema } from '../../interfaces'
import { TableProps } from './Table'

export interface TableState {
  name: string
  table: ITable
  schema: ISchema
  report?: IReport
  source?: string
  height: string
  isOnlyErrors?: boolean
  isReportView?: boolean
  isSourceView?: boolean
  updateTable: (rowNumber: number, fieldName: string, value: any) => void
}

export interface TableLogic {
  toggleSourceView: () => void
  toggleReportView: () => void
  toggleErrorsView: () => void
}

export function makeStore(props: TableProps) {
  const initialState = {
    name: props.name || 'table',
    table: cloneDeep(props.table),
    schema: cloneDeep(props.schema),
    height: props.height || '600px',
    updateTable: props.updateTable || noop,
  }

  return create<TableState & TableLogic>((set, get) => ({
    ...initialState,

    // Page

    toggleSourceView: () =>
      set({ isSourceView: !get().isSourceView, isReportView: false }),
    toggleReportView: () =>
      set({ isReportView: !get().isReportView, isSourceView: false }),
    toggleErrorsView: () =>
      set({
        isOnlyErrors: !get().isOnlyErrors,
        isSourceView: false,
        isReportView: false,
      }),
  }))
}

export const { Provider, useStore } = createContext<TableState & TableLogic>()
