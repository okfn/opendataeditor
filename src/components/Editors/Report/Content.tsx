import * as React from 'react'
import Box from '@mui/material/Box'
import Report from '../../Views/Report'
import { useStore } from './store'

export default function Content() {
  const report = useStore((state) => state.record.report)
  return (
    <Box sx={{ paddingX: 2 }}>
      <Report report={report} />
    </Box>
  )
}
