import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'
import PublishIcon from '@mui/icons-material/Publish'

export default function Menu() {
  const theme = useTheme()
  // TODO: recover Publish color based on report.valid
  // const report = useStore((state) => state.file.report)
  const togglePublish = useStore((state) => state.togglePublish)
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
      <Button variant="text" startIcon={<PublishIcon />} onClick={() => togglePublish()}>
        Publish
      </Button>
    </Box>
  )
}
