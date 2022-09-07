import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Editor from './Editor'

// TODO: remove borderTop hack

export default function Layout() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(56) }}>
      <Box sx={{ height: theme.spacing(48), borderTop: 'solid 1px white' }}>
        <Editor />
      </Box>
      <Box sx={{ height: theme.spacing(8) }}>
        <Actions />
      </Box>
    </Box>
  )
}
