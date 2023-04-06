import * as React from 'react'
import Box from '@mui/material/Box'
import Code from '../../../Parts/Code'
import * as helpers from '../../../../helpers'
import { useStore } from '../store'

export default function SourcePanel() {
  const original = useStore((state) => state.original)
  if (!original) return null
  const text = helpers.bytesToBase64(original)
  return (
    <Box sx={{ paddingY: 2, overflowY: 'auto' }}>
      <Code source={text} />
    </Box>
  )
}
