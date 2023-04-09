import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import YesNoField from '../../../Parts/Fields/YesNoField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import * as settings from '../../../../settings'
import { useStore } from '../store'

export default function Chart() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Chart" onHeadingClick={() => updateHelp('chart')}>
      <Columns spacing={3}>
        <Box>
          <Table />
          <Preset />
        </Box>
        <Box></Box>
      </Columns>
    </EditorSection>
  )
}

function Table() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('dialect/title')}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
    />
  )
}

function Preset() {
  const description = useStore((state) => state.descriptor.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onFocus={() => updateHelp('dialect/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}
