import * as React from 'react'
import InputField from '../../../Parts/Fields/InputField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import Columns from '../../../Parts/Columns'
import { useStore } from '../store'

export default function ConfigPanel() {
  const query = useStore((state) => state.query)
  const axisX = useStore((state) => state.axisX)
  const axisY = useStore((state) => state.axisY)
  const setQuery = useStore((state) => state.setQuery)
  const setAxisX = useStore((state) => state.setAxisX)
  const setAxisY = useStore((state) => state.setAxisY)
  return (
    <Columns spacing={2}>
      <MultilineField
        rows={6}
        label="Query"
        value={query}
        onChange={(query) => setQuery(query)}
      />
      <Columns spacing={2}>
        <InputField
          label="Axis (X)"
          value={axisX}
          onChange={(axisX) => setAxisX(axisX)}
        />
        <InputField
          label="Axis (Y)"
          value={axisY}
          onChange={(acisY) => setAxisY(acisY)}
        />
      </Columns>
    </Columns>
  )
}
