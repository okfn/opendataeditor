import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Table from '../../Table'
import Report from '../../Report'
import { useStore } from '../store'

// TODO: rework (especially how we work with height)
// TODO: use AutoSizer?

export default function Data() {
  const theme = useTheme()
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  // const isSourceView = useStore((state) => state.isSourceView)
  const isReportView = useStore((state) => state.isReportView)
  const isErrorsView = useStore((state) => state.isErrorsView)
  const updateTable = useStore((state) => state.updateTable)
  const resource = useStore((state) => state.resource)
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const isFooterOpen = isMetadataOpen
  const footerHeight = isFooterOpen ? theme.spacing(56 + 8 + 2) : theme.spacing(8)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight})`
  if (!resource || !table || !report) return null
  // if (isSourceView) return <File file={file} />
  if (isReportView) return <Report descriptor={report} />
  return (
    <Table
      table={table}
      schema={resource.schema}
      report={report}
      height={contentHeight}
      updateTable={updateTable}
      isErrorsView={isErrorsView}
    />
  )
}
