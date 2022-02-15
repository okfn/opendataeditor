import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import { assert } from 'ts-essentials'
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
  const table = useStore((state) => state.table)
  const file = useStore((state) => state.file)
  const report = useStore((state) => state.report)
  const isFooterOpen = contentType === 'data' && isMetadataOpen
  const footerHeight = isFooterOpen ? theme.spacing(56 + 8 + 2) : theme.spacing(8)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight})`
  assert(file)
  assert(resource)
  assert(table)
  assert(report)
  if (isSourceView) return <File file={file} />
  if (isReportView) return <Report descriptor={report} />
  return <Table table={table} report={report} height={contentHeight} />
}
