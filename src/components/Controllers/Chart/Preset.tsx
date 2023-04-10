import * as React from 'react'
import Columns from '../../Parts/Columns'

export default function Preset() {
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <PresetBar />
    </Columns>
  )
}

function PresetBar() {
  return <div>bar</div>
}
