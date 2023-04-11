import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Editor() {
  const modified = useStore((state) => state.modified)
  if (!modified) return null
  return (
    <Box sx={{ height: '100%' }}>
      <VegaLite
        spec={modified as any}
        width={modified.width || 600}
        height={modified.height || 400}
      />
    </Box>
  )
}
