import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Table from '../../Views/Table'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const table = useStore((state) => state.table)
  const path = useStore((state) => state.record.path)
  const report = useStore((state) => state.record.report)
  const tablePatch = useStore((state) => state.tablePatch)
  const updatePatch = useStore((state) => state.updatePatch)
  const loadTable = useStore((state) => state.loadTable)
  const height = `calc(100vh - ${theme.spacing(8 + 6 + 8)})`
  React.useEffect(() => {
    loadTable().catch(console.error)
  }, [path])
  if (!table) return null
  return (
    <Table
      table={table}
      report={report}
      height={height}
      onUpdate={updatePatch}
      tablePatch={tablePatch}
    />
  )
}
