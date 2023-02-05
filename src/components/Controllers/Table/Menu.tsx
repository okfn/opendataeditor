import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ValidIcon from '@mui/icons-material/Check'
import InvalidIcon from '@mui/icons-material/ErrorOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Menu() {
  const theme = useTheme()
  const isMetadata = useStore((state) => state.isMetadata)
  const report = useStore((state) => state.file.report)
  const toggleMetadata = useStore((state) => state.toggleMetadata)
  return (
    <Box
      sx={{
        position: 'absolute',
        right: 0,
        top: theme.spacing(-6),
        zIndex: 100,
        lineHeight: theme.spacing(6),
        borderTop: 1,
        borderColor: 'divider',
        paddingX: 2,
      }}
    >
      <Button
        variant="text"
        title="Show Errors"
        color={report.valid ? 'secondary' : 'error'}
        onClick={() => alert('Open errors panel')}
        startIcon={report.valid ? <ValidIcon /> : <InvalidIcon />}
        sx={{ marginRight: 1 }}
      >
        Errors ({report.stats.errors})
      </Button>
      <Button
        variant="text"
        startIcon={<SettingsIcon />}
        color={report.valid ? 'secondary' : 'error'}
        onClick={() => toggleMetadata()}
        title={isMetadata ? 'Hide Metadata' : 'Show Metadata'}
        sx={{ textDecoration: isMetadata ? 'underline !important' : 'none' }}
      >
        Metadata
      </Button>
    </Box>
  )
}
