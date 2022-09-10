import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from '../Actions'
import Editor from '../Editor'

export default function DataView() {
  return (
    <Box>
      <Editor editable={true} />
      <Actions />
    </Box>
  )
}
