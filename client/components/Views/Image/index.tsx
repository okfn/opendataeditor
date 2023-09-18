import * as React from 'react'
import Box from '@mui/material/Box'
import * as helpers from '../../../helpers'

export interface ImageView {
  format?: string
  bytes?: ArrayBuffer
}

export default function Image(props: ImageView) {
  if (!props.format) return null
  if (!props.bytes) return null
  const text = helpers.bytesToBase64(props.bytes)
  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      <img
        src={`data:image/${props.format};base64,${text}`}
        style={{ maxHeight: '100%' }}
      />
    </Box>
  )
}
