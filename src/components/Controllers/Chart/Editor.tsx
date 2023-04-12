import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Editor() {
  const rendered = useStore((state) => state.rendered)
  if (!rendered) return null
  return (
    <Box sx={{ height: '100%' }}>
      <VegaLite
        spec={rendered as any}
        width={rendered.width || 600}
        height={rendered.height || 400}
      />
    </Box>
  )
}
