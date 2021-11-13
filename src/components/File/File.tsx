import * as React from 'react'
import Box from '@mui/material/Box'

interface FileProps {
  state: any
}

export default function File(props: FileProps) {
  if (!props.state.text) return null
  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <pre>
        <code>{props.state.text}</code>
      </pre>
    </Box>
  )
}
