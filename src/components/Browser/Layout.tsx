import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '../Table'
import Header from './Header'
import { useStore } from './store'

// TODO: rename to Browser
export default function Layout() {
  const theme = useTheme()
  const resource = useStore((state) => state.resource)
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const loadEverything = useStore((state) => state.loadEverything)
  const headerHeight = theme.spacing(8)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [])
  return (
    <Box>
      <Box sx={{ height: headerHeight }}>
        <Header />
      </Box>
      <Box>
        {resource && table && report && (
          <Table resource={resource} table={table} report={report} />
        )}
      </Box>
    </Box>
  )
}
