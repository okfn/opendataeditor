import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Content() {
  const format = useStore((state) => state.file.record?.resource.format)
  const content = useStore((state) => state.content)
  if (!format) return null
  if (!content) return null
  return (
    <Box sx={{ padding: 2 }}>
      <img src={`data:image/${format};base64,${content}`} />
    </Box>
  )
}
