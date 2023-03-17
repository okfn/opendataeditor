import * as React from 'react'
import Box from '@mui/material/Box'
import HeadingBox from '../../../Parts/Groups/HeadingBox'
import InputField from '../../../Parts/Fields/InputField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import MultiselectField from '../../../Parts/Fields/MultiselectField'
import Columns from '../../../Parts/Columns'
import { useStore, selectors } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>Schema</HeadingBox>
      <Columns spacing={2}>
        <Box>
          <Title />
          <Description />
        </Box>
        <Box>
          <PrimaryKey />
          <MissingValues />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function Title() {
  const title = useStore((state) => state.schema.title)
  const updateSchema = useStore((state) => state.updateSchema)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onChange={(value) => updateSchema({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.schema.description)
  const updateSchema = useStore((state) => state.updateSchema)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onChange={(value) => updateSchema({ description: value || undefined })}
    />
  )
}

// TODO: support empty strings
function MissingValues() {
  const missingValues = useStore((state) => state.schema.missingValues)
  const updateSchema = useStore((state) => state.updateSchema)
  return (
    <InputField
      label="Missing Values"
      value={(missingValues || []).join(',')}
      onChange={(value) =>
        updateSchema({ missingValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function PrimaryKey() {
  const fieldNames = useStore(selectors.fieldNames)
  const primaryKey = useStore((state) => state.schema.primaryKey)
  const updateSchema = useStore((state) => state.updateSchema)
  return (
    <MultiselectField
      label="Primary Key"
      value={primaryKey || []}
      options={fieldNames}
      onChange={(value) => updateSchema({ primaryKey: value || undefined })}
    />
  )
}
