import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Report from '../../Report'
import { useStore } from '../store'

export default function ReportView() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const report = useStore((state) => state.report)
  if (!report) return null
  return (
    <Box sx={{ paddingLeft: 2, paddingRight: 2, height, overflowY: 'auto' }}>
      <Report report={report} />
    </Box>
  )
}
