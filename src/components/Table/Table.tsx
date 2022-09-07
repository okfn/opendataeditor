import * as React from 'react'
import { Provider, makeStore } from './store'
import { ITable, ISchema, IReport } from '../../interfaces'
import Layout from './Layout'

export interface TableProps {
  name?: string
  table: ITable
  schema: ISchema
  report?: IReport
  source?: string
  updateTable?: (rowNumber: number, fieldName: string, value: any) => void
  onMetadataClick?: () => void
  isErrorsView?: boolean
}

export default function Table(props: TableProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
