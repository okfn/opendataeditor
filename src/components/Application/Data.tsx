import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Table from '../Table'
import Box from '@mui/material/Box'
import { useStore } from './store'

// TODO: rework (especially how we work with height)
// TODO: use AutoSizer?

export default function Data() {
  const theme = useTheme()
  // const isSourceView = useStore((state) => state.isSourceView)
  const updateTable = useStore((state) => state.updateTable)
  const resource = useStore((state) => state.resource)
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const footerHeight = isMetadataOpen ? theme.spacing(56 + 2) : theme.spacing(0)
  const contentHeight = `calc(100vh - ${theme.spacing(16)} - ${footerHeight} - 1px)`
  if (!resource || !table || !report) return null
  return (
    <Box sx={{ height: contentHeight }}>
      <Table
        table={table}
        schema={resource.schema!}
        report={report}
        height={contentHeight}
        updateTable={updateTable}
      />
    </Box>
  )
}
