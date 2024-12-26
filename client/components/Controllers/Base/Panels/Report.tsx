import Box from '@mui/material/Box'
import * as types from '../../../../types'
import Report from '../../../Views/Report'

export interface ReportPanelProps {
  report?: types.IReport
}

export default function ReportPanel(props: ReportPanelProps) {
  if (!props.report) return null

  return (
    <Box sx={{ paddingX: 2 }}>
      <Report report={props.report} shallow />
    </Box>
  )
}
