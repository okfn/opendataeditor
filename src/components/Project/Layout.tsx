import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Editor from './Editor'

export default function Layout() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Editor />
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Actions />
      </Box>
    </Box>
  )
}
