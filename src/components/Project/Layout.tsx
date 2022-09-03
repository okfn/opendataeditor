import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Editor from './Editor'

export default function Layout() {
  return (
    <React.Fragment>
      <Box>
        <Box>
          <Editor />
        </Box>
        <Box>
          <Actions />
        </Box>
      </Box>
    </React.Fragment>
  )
}
