import * as React from 'react'
import { assert } from 'ts-essentials'
import Box from '@mui/material/Box'
import Report from '../../Report'
import Table from '../../Table'
import File from '../../File'
import { useStore } from '../store'

// TODO: rework

export default function Data() {
  const contentType = useStore((state) => state.contentType)
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const isSourceView = useStore((state) => state.isSourceView)
  const isReportView = useStore((state) => state.isReportView)
  const resource = useStore((state) => state.resource)
  const rows = useStore((state) => state.rows)
  const text = useStore((state) => state.text)
  const report = useStore((state) => state.report)
  const footerHeight = contentType === 'data' && isMetadataOpen ? '544px' : '64px'
  const contentHeight = `calc(100vh - 64px - ${footerHeight})`
  assert(resource)
  assert(rows)
  // TODO: text might not be available while it will be still correct state
  assert(text)
  assert(report)
  if (isSourceView) return <File text={text} />
  if (isReportView) return <Report report={report} />
  return (
    <Box sx={{ m: -2 }}>
      <Table schema={resource.schema} rows={rows} height={contentHeight} />
    </Box>
  )
}
