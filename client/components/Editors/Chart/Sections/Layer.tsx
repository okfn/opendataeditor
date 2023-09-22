import Box from '@mui/material/Box'
import SelectField from '../../../Parts/Fields/Select'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore } from '../store'
import * as settings from '../settings'

export default function Layer() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Layer" onHeadingClick={() => updateHelp('layer')}>
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
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const mark = descriptor.layer![layerIndex - 1].mark ?? ''
  const type = typeof mark === 'object' ? mark!.type : mark
  return (
    <SelectField
      label="Mark"
      value={type || ''}
      options={settings.MARKS}
      onFocus={() => updateHelp('layer/mark')}
      onChange={(value) => {
        if (!value) return
        descriptor.layer![layerIndex - 1].mark = value
        console.log(descriptor)
        updateState({ descriptor })
      }}
    />
  )
}
