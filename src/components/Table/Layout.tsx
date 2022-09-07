import * as React from 'react'
import Box from '@mui/material/Box'
import '@inovua/reactdatagrid-community/index.css'
import Actions from './Actions'
import Content from './Content'

export default function Layout() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Content />
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Actions />
      </Box>
    </Box>
  )
}
