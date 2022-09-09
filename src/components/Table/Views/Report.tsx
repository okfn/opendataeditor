import * as React from 'react'
import Box from '@mui/material/Box'
import Report from '../../Report'
import { useStore } from '../store'

export default function ReportView() {
  const report = useStore((state) => state.report)
  if (!report) return null
  return (
    <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
      <Report descriptor={report} />
    </Box>
  )
}
