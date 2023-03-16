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
  const schema = useStore((state) => state.schema)
  const title = useStore((state) => state.schema.title)
  const updateSchema = useStore((state) => state.updateSchema)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onChange={(title) => {
        schema.title = title || undefined
        updateSchema(schema)
      }}
    />
  )
}

function Description() {
  const schema = useStore((state) => state.schema)
  const description = useStore((state) => state.schema.description)
  const updateSchema = useStore((state) => state.updateSchema)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onChange={(description) => {
        schema.description = description || undefined
        updateSchema(schema)
      }}
    />
  )
}

// TODO: support empty strings
function MissingValues() {
  const missingValues = useStore((state) => state.schema.missingValues)
  const updateSchema = useStore((state) => state.updateSchema)
  const schema = useStore((state) => state.schema)
  return (
    <InputField
      label="Missing Values"
      value={(missingValues || []).join(',')}
      onChange={(missingValues) => {
        schema.missingValues = missingValues ? missingValues.split(',') : undefined
        updateSchema(schema)
      }}
    />
  )
}

function PrimaryKey() {
  const fieldNames = useStore(selectors.fieldNames)
  const primaryKey = useStore((state) => state.schema.primaryKey)
  const updateSchema = useStore((state) => state.updateSchema)
  const schema = useStore((state) => state.schema)
  return (
    <MultiselectField
      label="Primary Key"
      value={primaryKey || []}
      options={fieldNames}
      onChange={(primaryKey) => {
        schema.primaryKey = primaryKey.length ? primaryKey : undefined
        updateSchema(schema)
      }}
    />
  )
}
