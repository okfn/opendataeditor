import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Editor() {
  const chart = useStore((state) => state.chart)
  const fields = useStore((state) => state.fields)
  // const updateState = useStore((state) => state.updateState)
  if (!fields) return null
  return (
    <Box sx={{ borderLeft: 'solid 1px #ddd', height: '100%' }}>
      {!!chart && <VegaLite spec={chart as any} width={600} height={600} />}
    </Box>
  )
}
