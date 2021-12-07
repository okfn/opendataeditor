import * as React from 'react'
import Box from '@mui/material/Box'

// TODO: restyle scrolls (use Table's style)

interface FileProps {
  text: string
}

export default function File(props: FileProps) {
  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <pre style={{ margin: 0 }}>
        <code>{props.text}</code>
      </pre>
    </Box>
  )
}
