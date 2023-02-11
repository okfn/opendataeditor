import * as React from 'react'
import Box from '@mui/material/Box'
import Code from '../../../Parts/Code'
import { useStore } from '../store'

export default function SourcePanel() {
  const source = useStore((state) => state.source)
  if (!source) return null
  return (
    <Box sx={{ paddingY: 2, overflowY: 'auto' }}>
      <Code source={source} />
    </Box>
  )
}
