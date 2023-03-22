import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import MultiselectField from '../../../Parts/Fields/MultiselectField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import { useStore, selectors } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Schema" onHeadingClick={() => updateHelp('schema')}>
      <Columns spacing={3}>
        <Box>
          <Title />
          <Description />
        </Box>
        <Box>
          <PrimaryKey />
          <MissingValues />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('schema/title')}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onFocus={() => updateHelp('schema/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}

function PrimaryKey() {
  const fieldNames = useStore(selectors.fieldNames)
  const primaryKey = useStore((state) => state.descriptor.primaryKey)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <MultiselectField
      label="Primary Key"
      value={primaryKey || []}
      options={fieldNames}
      onFocus={() => updateHelp('schema/primaryKey')}
      onChange={(value) => updateDescriptor({ primaryKey: value || undefined })}
    />
  )
}

// TODO: support empty strings
function MissingValues() {
  const missingValues = useStore((state) => state.descriptor.missingValues)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Missing Values"
      value={(missingValues || []).join(',')}
      onFocus={() => updateHelp('schema/missingValues')}
      onChange={(value) =>
        updateDescriptor({ missingValues: value ? value.split(',') : undefined })
      }
    />
  )
}
