import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import InputField from '../../Library/Fields/InputField'
import SelectField from '../../Library/Fields/SelectField'
import { useStore, selectors, select } from '../store'

// TODO: fix logic/improve
// TODO: support more than self-referencing

export default function ForeignKey() {
  return (
    <Columns spacing={3}>
      <Box>
        <SourceField />
        <TargetField />
      </Box>
      <Box>
        <TargetResource />
      </Box>
    </Columns>
  )
}

function SourceField() {
  const fields = useStore(select(selectors.foreignKey, (fk) => fk.fields))
  const fieldNames = useStore(selectors.fieldNames)
  const updateElement = useStore((state) => state.updateElement)
  return (
    <SelectField
      label="Source Field"
      value={fields[0]}
      options={fieldNames}
      onChange={(name) => updateElement({ fields: [name] })}
    />
  )
}

function TargetField() {
  const fieldNames = useStore(selectors.fieldNames)
  const reference = useStore(select(selectors.foreignKey, (fk) => fk.reference))
  const updateElement = useStore((state) => state.updateElement)
  return (
    <SelectField
      label="Target Field"
      value={reference.fields[0]}
      options={fieldNames}
      onChange={(name) => updateElement({ reference: { ...reference, fields: [name] } })}
    />
  )
}

function TargetResource() {
  const updateElement = useStore((state) => state.updateElement)
  const reference = useStore(select(selectors.foreignKey, (fk) => fk.reference))
  return (
    <InputField
      disabled
      label="Target Resource"
      value={reference.resource}
      onChange={(resource) => updateElement({ reference: { ...reference, resource } })}
    />
  )
}
