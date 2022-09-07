import create from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { IReport, ITable } from '../../interfaces'
import { ISchema } from '../../interfaces'
import { TableProps } from './Table'

type IContentType = 'table' | 'report' | 'source'

export interface TableState {
  name: string
  table: ITable
  schema: ISchema
  report?: IReport
  source?: string
  contentType: IContentType
  isOnlyErrors?: boolean
  updateTable: (rowNumber: number, fieldName: string, value: any) => void
  onMetadataClick: () => void
}

export interface TableLogic {
  setContentType: (contentType: IContentType) => void
  toggleOnlyErrors: () => void
}

export function makeStore(props: TableProps) {
  const initialState = {
    name: props.name || 'table',
    table: cloneDeep(props.table),
    schema: cloneDeep(props.schema),
    report: props.report,
    source: props.source,
    contentType: 'table' as IContentType,
    updateTable: props.updateTable || noop,
    onMetadataClick: props.onMetadataClick || noop,
  }

  return create<TableState & TableLogic>((set, get) => ({
    ...initialState,

    // Page

    setContentType: (contentType) => {
      contentType = get().contentType !== contentType ? contentType : 'table'
      set({ contentType })
    },
    toggleOnlyErrors: () => set({ isOnlyErrors: !get().isOnlyErrors }),
  }))
}

export const { Provider, useStore } = createContext<TableState & TableLogic>()
