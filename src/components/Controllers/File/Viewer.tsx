import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore } from './store'
import * as helpers from '../../../helpers'

export default function Viewer() {
  const format = useStore((state) => state.file?.record?.resource.format)
  if (!format) return null
  if (['png', 'jpg'].includes(format || '')) return <ImageViewer />
  return <NonSupportedViewer />
}

function ImageViewer() {
  const format = useStore((state) => state.file?.record?.resource.format)
  const source = useStore((state) => state.source)
  if (!format) return null
  if (!source) return null
  const text = helpers.bytesToBase64(source)
  return (
    <Box sx={{ padding: 2 }}>
      <img src={`data:image/${format};base64,${text}`} />
    </Box>
  )
}

function NonSupportedViewer() {
  const format = useStore((state) => state.file?.record?.resource.format)
  if (!format) return null
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
      This file type does not have a supported data view ({format})
    </Box>
  )
}
