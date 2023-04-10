import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import ChartEditor from '../../Editors/Chart'
import { useStore } from './store'

export default function Editor() {
  const chart = useStore((state) => state.chart)
  const fields = useStore((state) => state.fields)
  const updateState = useStore((state) => state.updateState)
  if (!fields) return null
  return (
    <Box sx={{ mt: 2 }}>
      {!!chart && <VegaLite spec={chart} width={1000} height={550} />}
      <ChartEditor fields={fields} onChange={(chart) => updateState({ chart })} />
    </Box>
  )
}
