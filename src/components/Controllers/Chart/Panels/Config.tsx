import * as React from 'react'
import InputField from '../../../Parts/Fields/InputField'
import VerticalTabs from '../../../Parts/VerticalTabs'
import { useStore } from '../store'

export default function ConfigPanel() {
  const axisX = useStore((state) => state.axisX)
  const axisY = useStore((state) => state.axisY)
  const setAxisX = useStore((state) => state.setAxisX)
  const setAxisY = useStore((state) => state.setAxisY)
  return (
    <VerticalTabs labels={['Data', 'Axis (X)', 'Axis (Y)']}>
      <InputField label="Select table/view: show schema/data preview" value="" />
      <InputField label="Axis (X)" value={axisX} onChange={(axisX) => setAxisX(axisX)} />
      <InputField label="Axis (Y)" value={axisY} onChange={(acisY) => setAxisY(acisY)} />
    </VerticalTabs>
  )
}
