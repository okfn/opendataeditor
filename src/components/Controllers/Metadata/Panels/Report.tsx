import * as React from 'react'
import Box from '@mui/material/Box'
// import Report from '../../../Editors/Report'
import { useStore } from '../store'

// TODO: fix
export default function ReportPanel() {
  const report = useStore((state) => state.file.record?.report)
  if (!report) return null
  return <Box sx={{ padding: 2 }}>report</Box>
  // return (
  // <Box>
  // <Report report={report} />
  // </Box>
  // )
}
