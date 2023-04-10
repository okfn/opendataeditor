import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import Preset from './Preset'
import { useStore } from './store'

export default function Editor() {
  const chart = useStore((state) => state.chart)
  const fields = useStore((state) => state.fields)
  // const updateState = useStore((state) => state.updateState)
  if (!fields) return null
  return (
    <Box
      sx={{ borderTop: 'solid 1px #ddd', borderLeft: 'solid 1px #ddd', height: '100%' }}
    >
      {!chart && <Preset />}
      {!!chart && <VegaLite spec={chart} width={1000} height={550} />}
    </Box>
  )
}
