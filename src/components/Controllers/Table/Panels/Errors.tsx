import * as React from 'react'
import Box from '@mui/material/Box'
import Report from '../../../Editors/Report'
import { useStore } from '../store'

export default function ErrorsPanel() {
  const report = useStore((state) => state.file.record?.report)
  if (!report) return null
  return (
    <Box>
      <Report report={report} />
    </Box>
  )
}
