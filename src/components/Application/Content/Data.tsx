import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import { assert } from 'ts-essentials'
import Box from '@mui/material/Box'
import Report from '../../Report'
import Table from '../../Table'
import File from '../../File'
import { useStore } from '../store'

// TODO: rework (especially how we work with height)
// TODO: use AutoSizer?

export default function Data() {
  const theme = useTheme()
  const contentType = useStore((state) => state.contentType)
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const isSourceView = useStore((state) => state.isSourceView)
  const isReportView = useStore((state) => state.isReportView)
  const resource = useStore((state) => state.resource)
  const rows = useStore((state) => state.rows)
  const text = useStore((state) => state.text)
  const report = useStore((state) => state.report)
  const isFooterOpen = contentType === 'data' && isMetadataOpen
  const footerHeight = isFooterOpen ? theme.spacing(66) : theme.spacing(8)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight})`
  assert(resource)
  assert(rows)
  // TODO: text might not be available while it will be still correct state
  assert(text)
  assert(report)
  if (isSourceView) return <File text={text} />
  if (isReportView) return <Report descriptor={report} />
  return (
    <Box sx={{ m: -2 }}>
      <Table schema={resource.schema} rows={rows} height={contentHeight} />
    </Box>
  )
}
