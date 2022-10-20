import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Content from './Content'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ height }}>
        <Content />
      </Box>
    </Box>
  )
}
