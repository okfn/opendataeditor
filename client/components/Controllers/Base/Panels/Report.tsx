import Box from '@mui/material/Box'
import Report from '../../../Views/Report'
import * as types from '../../../../types'

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
