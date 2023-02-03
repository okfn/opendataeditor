import * as React from 'react'
import { VegaLite } from 'react-vega'
import Box from '@mui/material/Box'
import InputField from '../../Parts/Fields/InputField'
import Columns from '../../Parts/Columns'
import { useStore } from './store'

export default function Content() {
  return (
    <Box sx={{ padding: 2 }}>
      <Config />
      <Result />
    </Box>
  )
}

function Config() {
  const axisX = useStore((state) => state.axisX)
  const axisY = useStore((state) => state.axisY)
  const setAxisX = useStore((state) => state.setAxisX)
  const setAxisY = useStore((state) => state.setAxisY)
  return (
    <Columns spacing={2}>
      <InputField label="Axis (X)" value={axisX} onChange={(axisX) => setAxisX(axisX)} />
      <InputField label="Axis (Y)" value={axisY} onChange={(acisY) => setAxisY(acisY)} />
    </Columns>
  )
}

function Result() {
  const chart = useStore((state) => state.chart)
  return (
    <Box sx={{ mt: 2 }}>
      <VegaLite spec={chart} width={1000} height={550} />
    </Box>
  )
}
