import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Editor() {
  const chart = useStore((state) => state.chart)
  return (
    <Box sx={{ mt: 2 }}>
      <VegaLite spec={chart} width={1000} height={550} />
    </Box>
  )
}
