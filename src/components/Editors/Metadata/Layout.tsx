import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Content from './Content'
import Header from './Header'

export default function Layout() {
  return (
    <Box>
      <Header />
      <Content />
      <Actions />
    </Box>
  )
}
