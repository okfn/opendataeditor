import * as React from 'react'
import Box from '@mui/material/Box'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import SourcePanel from './Panels/Source'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  return (
    <Box
      hidden={!panel}
      sx={{
        padding: 2,
        height: theme.spacing(48),
        borderTop: 'solid 1px #ddd',
        border: panel === 'source' ? 'solid 3px #000' : undefined,
        overflowY: panel === 'source' ? 'hidden' : undefined,
        backgroundColor: panel === 'source' ? '#333' : undefined,
        color: panel === 'source' ? '#eee' : undefined,
        fontSize: panel === 'source' ? '80%' : undefined,
      }}
    >
      {panel === 'metadata' && <MetadataPanel />}
      {panel === 'report' && <ReportPanel />}
      {panel === 'source' && <SourcePanel />}
    </Box>
  )
}
