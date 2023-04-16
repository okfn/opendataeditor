import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore } from '../store'

export default function SourcePanel() {
  const file = useStore((state) => state.file)
  if (!file) return null
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#fafafa',
        padding: 2,
        color: '#777',
        fontFamily: 'Monospace',
      }}
    >
      This file type does not have a supported source view ({file.record!.resource.format}
      )
    </Box>
  )
}
