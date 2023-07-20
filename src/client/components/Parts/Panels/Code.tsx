import * as React from 'react'
import Box from '@mui/material/Box'

export interface CodePanelProps {
  children: React.ReactNode
}

export default function CodePanel(props: CodePanelProps) {
  return (
    <Box sx={{ fontSize: '14px', padding: 2 }}>
      <pre style={{ margin: 0 }}>
        <code>{props.children}</code>
      </pre>
    </Box>
  )
}
