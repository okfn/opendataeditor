import * as React from 'react'
import { Provider, makeStore } from './store'
import { ITable2, ITablePatch, IReport, IResource } from '../../interfaces'
import Layout from './Layout'

export interface TableProps {
  resource: IResource
  table: ITable2
  report?: IReport
  source?: string
  makeQuery?: (query: string) => ITable2
  exportTable?: (format: string) => string
  updateTable?: (patch: ITablePatch) => void
  updateResource?: () => void
}

export default function Table(props: TableProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
