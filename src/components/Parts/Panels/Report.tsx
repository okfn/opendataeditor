import * as React from 'react'
import Box from '@mui/material/Box'
import Report from '../Report'
import * as types from '../../../types'

export interface ReportPanelProps {
  report?: types.IReport
}

export default function ReportPanel(props: ReportPanelProps) {
  if (!props.report) return null
  return (
    <Box sx={{ paddingX: 2 }}>
      <Report report={props.report} />
    </Box>
  )
}
