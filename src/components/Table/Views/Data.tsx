import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Actions from '../Actions'
import Editor from '../Editor'

export default function DataView() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  return (
    <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Editor editable={true} />
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Actions />
      </Box>
    </Box>
  )
}
