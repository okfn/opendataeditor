import * as React from 'react'
import Box from '@mui/material/Box'

interface FileProps {
  text: string
}
export default function File(props: FileProps) {
  return (
    <Box sx={{ height: 540, width: '100%', overflow: 'auto' }}>
      <pre style={{ marginTop: 0 }}>
        <code>{props.text}</code>
      </pre>
    </Box>
  )
}
