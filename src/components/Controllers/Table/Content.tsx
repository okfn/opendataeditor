import * as React from 'react'
import Table from '../../Editors/Table'
import { useStore } from './store'

export default function Content() {
  const table = useStore((state) => state.table)
  const path = useStore((state) => state.file.path)
  const report = useStore((state) => state.file.record?.report)
  const tablePatch = useStore((state) => state.tablePatch)
  const updatePatch = useStore((state) => state.updatePatch)
  const loadTable = useStore((state) => state.loadTable)
  const selectedColumn = useStore((state) => state.selectedColumn)
  React.useEffect(() => {
    loadTable().catch(console.error)
  }, [path])
  if (!table) return null
  if (!report) return null
  return (
    <Table
      table={table}
      report={report}
      onUpdate={updatePatch}
      tablePatch={tablePatch}
      selectedColumn={selectedColumn}
    />
  )
}
