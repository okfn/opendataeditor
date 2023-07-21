import * as React from 'react'
import Box from '@mui/material/Box'
import SelectField from '../../../../Parts/Fields/Select'
import EditorSection from '../../../Base/Section'
import Columns from '../../../../Parts/Grids/Columns'
import { useStore } from '../../store'
import * as settings from '../../settings'

export default function LayerChart() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Chart" onHeadingClick={() => updateHelp('chart')}>
      <Columns spacing={3}>
        <Box>
          <Mark />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Mark() {
  const layerIndex = useStore((state) => state.layerIndex)
  const descriptor = useStore((state) => state.descriptor)
  const mark = useStore((state) => state.descriptor.mark)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const type = typeof mark === 'object' ? mark.type : mark
  console.log('descriptor', descriptor, type)
  return (
    <SelectField
      label="Mark"
      value={type || ''}
      options={settings.MARKS}
      onFocus={() => updateHelp('chart/mark')}
      onChange={(value) => {
        if (!value) return
        descriptor.layer![layerIndex - 1].mark = value
        updateState({ descriptor })
      }}
    />
  )
}
