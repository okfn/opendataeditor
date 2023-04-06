import * as React from 'react'
import Box from '@mui/material/Box'
import PreviewPanel from './Panels/Preview'
import ReportPanel from './Panels/Report'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

// TODO: rewrite
export default function Panel() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  return (
    <Box
      hidden={!panel}
      sx={{
        padding: 2,
        height: theme.spacing(48),
        borderTop: 'solid 1px #ddd',
        border: panel === 'preview' ? 'solid 3px #000' : undefined,
        overflowY: panel === 'preview' ? 'hidden' : undefined,
        backgroundColor: panel === 'preview' ? '#333' : undefined,
        color: panel === 'preview' ? '#eee' : undefined,
        fontSize: panel === 'preview' ? '80%' : undefined,
      }}
    >
      {panel === 'preview' && <PreviewPanel />}
      {panel === 'report' && <ReportPanel />}
    </Box>
  )
}
