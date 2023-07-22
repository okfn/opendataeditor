import * as React from 'react'
import Box from '@mui/material/Box'

export interface ScriptProps {
  text?: string
}

export default function Script(props: ScriptProps) {
  if (!props.text) return null
  return (
    <Box sx={{ fontSize: '14px', padding: 2 }}>
      <pre style={{ margin: 0 }}>
        <code>{props.text}</code>
      </pre>
    </Box>
  )
}
