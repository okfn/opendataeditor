import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Menu from './Menu'
import Content from './Content'

export default function Layout() {
  const theme = useTheme()
  // TODO: review
  const height = `calc(100vh - ${theme.spacing(24)})`
  return (
    <Box sx={{ height }}>
      <Menu />
      <Content />
    </Box>
  )
}
