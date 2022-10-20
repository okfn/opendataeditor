import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import Box from '@mui/material/Box'

// TODO: restyle scrolls (use Table's style)

interface SourceProps {
  source: string
}

export default function Source(props: SourceProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <pre style={{ margin: 0 }}>
          <code>{props.source}</code>
        </pre>
      </Box>
    </ThemeProvider>
  )
}
