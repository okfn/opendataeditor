import * as React from 'react'
import Box from '@mui/material/Box'

interface FileProps {
  // TODO: use proper prop (buffer/bytes?)
  text: string
}

export default function File(props: FileProps) {
  if (!props.text) return null
  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <pre style={{ marginTop: 0 }}>
        <code>{props.text}</code>
      </pre>
    </Box>
  )
}
