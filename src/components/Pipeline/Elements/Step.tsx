import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import InputField from '../../Library/Fields/InputField'
// import YesNoField from '../../Library/Fields/YesNoField'
import SelectField from '../../Library/Fields/SelectField'
// import ValuesField from '../../Library/Fields/ValuesField'
// import MultilineField from '../../Library/Fields/MultilineField'
// import DescriptorField from '../../Library/Fields/DescriptorField'
import * as settings from '../../../settings'
import { useStore, selectors, select } from '../store'

export default function Step() {
  const code = useStore(select(selectors.step, (step) => step.code))
  switch (code) {
    case 'field-add':
      return <FieldAddStep />
    case 'field-remove':
      return <FieldRemoveStep />
    case 'field-update':
      return <FieldUpdateStep />
    default:
      return null
  }
}

function FieldAddStep() {
  return (
    <Columns>
      <Box>
        <Code />
        <TargetName />
        <Value />
        <Formula />
      </Box>
      <Box />
    </Columns>
  )
}

function FieldRemoveStep() {
  return (
    <Columns>
      <Box>
        <Code />
        <SourceNames />
      </Box>
      <Box />
    </Columns>
  )
}

function FieldUpdateStep() {
  return (
    <Columns>
      <Box>
        <Code />
        <SourceName />
        <Value />
        <Formula />
      </Box>
      <Box>
        <NewName />
      </Box>
    </Columns>
  )
}

function Code() {
  const updateElement = useStore((state) => state.updateElement)
  const code = useStore(select(selectors.step, (step) => step.code))
  return (
    <SelectField
      label="Code"
      value={code}
      options={settings.STEPS}
      onChange={(code) => updateElement({ code })}
    />
  )
}

function SourceName() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const name = useStore(select(selectors.step, (step) => step.name))
  const schema = useStore((state) => state.schema)
  return (
    <SelectField
      label="Field Name"
      value={name || ''}
      options={schema.fields.map((field) => field.name)}
      onChange={(name) => updateElement({ name })}
    />
  )
}

function SourceNames() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const names = useStore(select(selectors.step, (step) => step.names))
  const schema = useStore((state) => state.schema)
  return (
    <SelectField
      label="Field Name"
      value={(names || []).join(',')}
      options={schema.fields.map((field) => field.name)}
      onChange={(name) => updateElement({ names: [name] })}
    />
  )
}

function TargetName() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const name = useStore(select(selectors.step, (step) => step.name))
  return (
    <InputField
      label="Name"
      value={name || ''}
      onChange={(name) => updateElement({ name })}
    />
  )
}

function Value() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const value = useStore(select(selectors.step, (step) => step.value))
  return (
    <InputField
      label="Value"
      value={value || ''}
      onChange={(value) => updateElement({ value })}
    />
  )
}

function Formula() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const formula = useStore(select(selectors.step, (step) => step.formula))
  return (
    <InputField
      label="Formula"
      value={formula || ''}
      onChange={(formula) => updateElement({ formula })}
    />
  )
}

function NewName() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const newName = useStore(select(selectors.step, (step) => step.newName))
  return (
    <InputField
      label="New Name"
      value={newName || ''}
      onChange={(newName) => updateElement({ newName })}
    />
  )
}
