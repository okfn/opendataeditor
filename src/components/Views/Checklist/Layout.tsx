import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Content from './Content'

export default function Layout() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(50) }}>
      <Box sx={{ height: theme.spacing(42) }}>
        <Content />
      </Box>
      <Box sx={{ height: theme.spacing(8) }}>
        <Actions />
      </Box>
    </Box>
  )
}
