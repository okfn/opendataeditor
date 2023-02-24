import * as React from 'react'
import Table from '../../Editors/Table'
import { IReport } from '../../../interfaces'
import { useStore } from './store'

export default function Content() {
  const table = useStore((state) => state.table)
  // TODO: it's a stub
  // @ts-ignore
  const report: IReport = { valid: true, tasks: [], warnings: [], errors: [] }
  if (!table) return null
  return (
    <React.Fragment>
      <Table table={table} report={report} />
    </React.Fragment>
  )
}
