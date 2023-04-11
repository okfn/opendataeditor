import * as React from 'react'
import Box from '@mui/material/Box'
import Code from '../../../Parts/Code'
import { useStore } from '../store'

export default function SourcePanel() {
  const modified = useStore((state) => state.modified)
  if (!modified) return null
  return (
    <Box sx={{ padding: 2 }}>
      <Code source={modified} />
    </Box>
  )
}
