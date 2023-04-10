import * as React from 'react'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/Tabs/Vertical'

export default function Preset() {
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <VerticalTabs labels={['Bar']}>
        <PresetBar />
      </VerticalTabs>
    </Columns>
  )
}

function PresetBar() {
  return <div>bar</div>
}
