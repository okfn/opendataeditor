import * as React from 'react'
import { IReport, ITable, ITablePatch } from '../../interfaces'
import { Provider, makeStore } from './store'
import Layout from './Layout'

export interface DatagridProps {
  table: ITable
  report: IReport
  onUpdate: (patch: ITablePatch) => void
}

export default function Datagrid(props: DatagridProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
