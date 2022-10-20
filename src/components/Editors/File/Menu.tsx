import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Menu() {
  const theme = useTheme()
  const isMetadata = useStore((state) => state.isMetadata)
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
        color="secondary"
        onClick={() => toggleMetadata()}
        startIcon={<SettingsIcon />}
        title={isMetadata ? 'Hide Metadata' : 'Show Metadata'}
        sx={{ textDecoration: isMetadata ? 'underline !important' : 'none' }}
      >
        Metadata
      </Button>
    </Box>
  )
}
