import * as React from 'react'
import Box from '@mui/material/Box'
import Preview from '../../../Parts/Preview'
import { useStore } from '../store'

export default function SourcePanel() {
  const descriptor = useStore((state) => state.descriptor)
  if (!descriptor) return null
  return (
    <Box>
      <Preview format="json" descriptor={descriptor || {}} />
    </Box>
  )
}
