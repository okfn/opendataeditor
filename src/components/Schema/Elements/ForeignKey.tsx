import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import InputField from '../../Library/Fields/InputField'
import SelectField from '../../Library/Fields/SelectField'
import { useStore, selectors, select } from '../store'

// TODO: fix logic/improve

export default function ForeignKey() {
  return (
    <Columns spacing={3}>
      <Box>
        <SourceField />
        <TargetField />
        <TargetResource />
      </Box>
      <Box></Box>
    </Columns>
  )
}

function SourceField() {
  const updateElement = useStore((state) => state.updateElement)
  const field = useStore(select(selectors.foreignKey, (fk) => fk.field))
  const fieldNames = useStore(selectors.fieldNames)
  return (
    <SelectField
      label="Source Field"
      value={field[0]}
      options={fieldNames}
      onChange={(name) => updateElement({ field: [name] })}
    />
  )
}

function TargetField() {
  const updateElement = useStore((state) => state.updateElement)
  const reference = useStore(select(selectors.foreignKey, (fk) => fk.reference))
  return (
    <InputField
      label="Target Field"
      value={reference.field[0]}
      onChange={(name) => updateElement({ reference: { ...reference, field: [name] } })}
    />
  )
}

function TargetResource() {
  const updateElement = useStore((state) => state.updateElement)
  const reference = useStore(select(selectors.foreignKey, (fk) => fk.reference))
  return (
    <InputField
      label="Target Field"
      value={reference.resource}
      onChange={(resource) => updateElement({ reference: { ...reference, resource } })}
    />
  )
}
