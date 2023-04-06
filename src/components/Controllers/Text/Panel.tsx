import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import SourcePanel from './Panels/Source'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  return (
    <Box
      hidden={!panel}
      sx={{
        overflowY: 'auto',
        height: theme.spacing(48),
        borderTop: 1,
        borderColor: 'divider',
        padding: 2,
      }}
    >
      {panel === 'metadata' && <MetadataPanel />}
      {panel === 'report' && <ReportPanel />}
      {panel === 'source' && <SourcePanel />}
    </Box>
  )
}
