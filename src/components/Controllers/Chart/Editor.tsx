import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Editor() {
  const fields = useStore((state) => state.fields)
  const modified = useStore((state) => state.modified)
  // const updateState = useStore((state) => state.updateState)
  if (!fields) return null
  return (
    <Box sx={{ height: '100%' }}>
      {!!modified && <VegaLite spec={modified as any} width={600} height={400} />}
    </Box>
  )
}
