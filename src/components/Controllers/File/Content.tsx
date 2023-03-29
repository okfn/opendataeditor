import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore } from './store'
import * as helpers from '../../../helpers'

export default function Content() {
  const format = useStore((state) => state.file.record?.resource.format)
  const content = useStore((state) => state.content)
  if (!format) return null
  if (!content) return null
  const text = helpers.bytesToBase64(content)
  return (
    <Box sx={{ padding: 2 }}>
      <img src={`data:image/${format};base64,${text}`} />
    </Box>
  )
}
