import * as React from 'react'
import Box from '@mui/material/Box'
import Preview from '../../../Parts/Preview'
import { useStore } from '../store'

export default function SourcePanel() {
  const revision = useStore((state) => state.revision)
  const modified = useStore((state) => state.modified)
  if (!modified) return null
  return (
    <Box sx={{ padding: 2, fontSize: '80%' }}>
      <Preview format="json" descriptor={modified || {}} revision={revision} />
    </Box>
  )
}
