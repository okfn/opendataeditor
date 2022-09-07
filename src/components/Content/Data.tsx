import * as React from 'react'
import Table from '../Table'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Layout() {
  const resource = useStore((state) => state.resource)
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const loadEverything = useStore((state) => state.loadEverything)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [])
  if (!resource || !table || !report) return null
  return (
    <Box>
      <Table height="100px" table={table} schema={resource.schema!} report={report} />
    </Box>
  )
}
