import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/InputField'
import YesNoField from '../../../Parts/Fields/YesNoField'
import SelectField from '../../../Parts/Fields/SelectField'
// import ValuesField from '../../../Parts/Fields/ValuesField'
// import MultilineField from '../../../Parts/Fields/MultilineField'
// import DescriptorField from '../../../Parts/Fields/DescriptorField'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'

// TODO: rework

export default function Step() {
  const type = useStore(select(selectors.step, (step) => step.type))
  switch (type) {
    case 'field-add':
      return <FieldAddStep />
    case 'field-filter':
      return <FieldFilterStep />
    case 'field-move':
      return <FieldMoveStep />
    case 'field-remove':
      return <FieldRemoveStep />
    case 'field-split':
      return <FieldSplitStep />
    case 'field-unpack':
      return <FieldUnpackStep />
    case 'field-update':
      return <FieldUpdateStep />
    default:
      return null
  }
}

function FieldAddStep() {
  return (
    <Columns spacing={3}>
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

function FieldFilterStep() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <SourceNames />
      </Box>
      <Box />
    </Columns>
  )
}

function FieldMoveStep() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <SourceName />
        <Position />
      </Box>
      <Box />
    </Columns>
  )
}

function FieldRemoveStep() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <SourceNames />
      </Box>
      <Box />
    </Columns>
  )
}

function FieldSplitStep() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <SourceName />
        <ToNames />
        <Preserve />
      </Box>
      <Box>
        <Pattern />
      </Box>
    </Columns>
  )
}

function FieldUnpackStep() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <SourceName />
        <ToNames />
        <Preserve />
      </Box>
      <Box />
    </Columns>
  )
}

function FieldUpdateStep() {
  return (
    <Columns spacing={3}>
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
  const type = useStore(select(selectors.step, (step) => step.type))
  return (
    <SelectField
      label="Code"
      value={type}
      options={settings.STEPS}
      onChange={(type) => updateElement({ type })}
    />
  )
}

function SourceName() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const name = useStore(select(selectors.step, (step) => step.name))
  const schema = useStore((state) => state.schema)
  if (!schema) {
    return (
      <InputField
        label="Field Name"
        value={name || ''}
        onChange={(name) => updateElement({ name })}
      />
    )
  }
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
  if (!schema) {
    return (
      <InputField
        label="Field Name"
        value={(names || []).join(',')}
        onChange={(name) => updateElement({ names: [name] })}
      />
    )
  }
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

function Position() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const position = useStore(select(selectors.step, (step) => step.position))
  return (
    <InputField
      type="number"
      label="Position"
      value={position || ''}
      onChange={(value) => updateElement({ position: parseInt(value) })}
    />
  )
}

function ToNames() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const toNames = useStore(select(selectors.step, (step) => step.toNames))
  return (
    <InputField
      label="To Field Names"
      value={(toNames || []).join(',')}
      onChange={(value) => updateElement({ toNames: value.split(',') })}
    />
  )
}

function Preserve() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const preserve = useStore(select(selectors.step, (step) => step.preserve))
  return (
    <YesNoField
      label="Preserve"
      value={preserve}
      onChange={(preserve) => updateElement({ preserve })}
    />
  )
}

function Pattern() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const pattern = useStore(select(selectors.step, (step) => step.pattern))
  return (
    <InputField
      label="Pattern"
      value={pattern || ''}
      onChange={(pattern) => updateElement({ pattern })}
    />
  )
}
