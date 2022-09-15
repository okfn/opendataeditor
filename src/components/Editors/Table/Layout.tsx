import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Content from './Content'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  return (
    <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <Content />
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Actions />
      </Box>
    </Box>
  )
}
