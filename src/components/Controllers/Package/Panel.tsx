import * as React from 'react'
import Box from '@mui/material/Box'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import SourcePanel from './Panels/Source'
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
        height: theme.spacing(48),
        borderTop: 'solid 1px #ddd',
        fontSize: panel === 'source' ? '80%' : undefined,
      }}
    >
      {panel === 'metadata' && <MetadataPanel />}
      {panel === 'source' && <SourcePanel />}
      {panel === 'report' && <ReportPanel />}
    </Box>
  )
}
