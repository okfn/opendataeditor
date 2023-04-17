import * as React from 'react'
import Table from '../../Editors/Table'
import { useStore } from './store'

export default function Editor() {
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.file?.record?.report)
  const loadTable = useStore((state) => state.loadTable)
  const updatePatch = useStore((state) => state.updatePatch)
  const selectedColumn = useStore((state) => state.selectedColumn)
  if (!table) return null
  if (!report) return null
  return (
    <Table
      loader={loadTable}
      schema={table.tableSchema}
      report={report}
      onChange={updatePatch}
      selectedColumn={selectedColumn}
    />
  )
}
