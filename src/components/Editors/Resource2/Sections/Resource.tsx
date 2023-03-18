import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import { useStore } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Resource" onHeadingClick={() => updateHelp('resource')}>
      <Columns spacing={3}>
        <Box>
          <Name />
          <Type />
        </Box>
        <Box>
          <Title />
          <Description />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Name() {
  const name = useStore((state) => state.resource.name)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateResource = useStore((state) => state.updateResource)
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('resource/name')}
      onChange={(name) => updateResource({ name })}
    />
  )
}

function Type() {
  const type = useStore((state) => state.resource.type)
  return <InputField disabled label="Type" value={type} />
}

function Title() {
  const title = useStore((state) => state.resource.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateResource = useStore((state) => state.updateResource)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('resource/title')}
      onChange={(value) => updateResource({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.resource.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateResource = useStore((state) => state.updateResource)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onFocus={() => updateHelp('resource/description')}
      onChange={(value) => updateResource({ description: value || undefined })}
    />
  )
}
