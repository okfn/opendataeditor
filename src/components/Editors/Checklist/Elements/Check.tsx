import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/InputField'
// import YesNoField from '../../../Parts/Fields/YesNoField'
import SelectField from '../../../Parts/Fields/SelectField'
// import ValuesField from '../../../Parts/Fields/ValuesField'
// import MultilineField from '../../../Parts/Fields/MultilineField'
// import DescriptorField from '../../../Parts/Fields/DescriptorField'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'

export default function Check() {
  const code = useStore(select(selectors.check, (check) => check.type))
  switch (code) {
    case 'duplicate-row':
      return <DuplicateRowCheck />
    case 'deviated-value':
      return <DeviatedValueCheck />
    case 'truncated-value':
      return <TruncatedValueCheck />
    case 'forbidden-value':
      return <ForbiddenValueCheck />
    case 'sequential-value':
      return <SequentialValueCheck />
    case 'row-constraint':
      return <RowConstraintCheck />
    case 'table-dimensions':
      return <TableDimensionsCheck />
    default:
      return null
  }
}

function DuplicateRowCheck() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
      </Box>
      <Box />
    </Columns>
  )
}

function DeviatedValueCheck() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <FieldName />
        <Average />
        <Interval />
      </Box>
      <Box />
    </Columns>
  )
}

function TruncatedValueCheck() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
      </Box>
      <Box />
    </Columns>
  )
}

function ForbiddenValueCheck() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <FieldName />
        <Values />
      </Box>
      <Box />
    </Columns>
  )
}

function SequentialValueCheck() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <FieldName />
      </Box>
      <Box />
    </Columns>
  )
}

function RowConstraintCheck() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <Formula />
      </Box>
      <Box />
    </Columns>
  )
}

function TableDimensionsCheck() {
  return (
    <Columns spacing={3}>
      <Box>
        <Code />
        <NumField checkArgument="numRows" label="Exact number of rows required" />
        <NumField checkArgument="minRows" label="Minimum number of rows required" />
        <NumField checkArgument="maxRows" label="Maximum number of rows required" />
        <NumField checkArgument="numFields" label="Exact number of fields required" />
        <NumField checkArgument="minFields" label="Minimum number of fields required" />
        <NumField checkArgument="maxFields" label="Maximum number of fields required" />
      </Box>
    </Columns>
  )
}

function NumField(props: { checkArgument: string; label: string }) {
  const updateElement = useStore((state) => state.updateElement)
  const stateFieldValue = useStore(
    // @ts-ignore
    select(selectors.check, (check) => check[props.checkArgument])
  )
  const newElement: { [checkArgument: string]: number } = {}
  const onChange = function (newValue: string) {
    newElement[props.checkArgument] = parseInt(newValue)
    updateElement(newElement)
  }
  return (
    <InputField
      type="number"
      label={props.label}
      value={stateFieldValue || ''}
      onChange={onChange}
    />
  )
}

function Code() {
  const updateElement = useStore((state) => state.updateElement)
  const code = useStore(select(selectors.check, (check) => check.type))
  return (
    <SelectField
      label="Code"
      value={code}
      options={settings.CHECKS}
      onChange={(code) => updateElement({ code })}
    />
  )
}

function FieldName() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const fieldName = useStore(select(selectors.check, (check) => check.fieldName))
  const schema = useStore((state) => state.schema)
  if (!schema) {
    return (
      <InputField
        label="Field Name"
        value={fieldName || ''}
        onChange={(fieldName) => updateElement({ fieldName })}
      />
    )
  }
  return (
    <SelectField
      label="Field Name"
      value={fieldName || ''}
      options={schema.fields.map((field) => field.name)}
      onChange={(fieldName) => updateElement({ fieldName })}
    />
  )
}

function Average() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const average = useStore(select(selectors.check, (check) => check.average))
  return (
    <SelectField
      label="Average"
      value={average || 'mean'}
      options={['mean', 'medium', 'mode']}
      onChange={(average) => updateElement({ average })}
    />
  )
}

function Interval() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const interval = useStore(select(selectors.check, (check) => check.interval))
  return (
    <InputField
      type="number"
      label="Interval"
      value={interval || ''}
      onChange={(interval) => updateElement({ interval })}
    />
  )
}

function Values() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const values = useStore(select(selectors.check, (check) => check.values))
  return (
    <InputField
      label="Values"
      value={(values || []).join(',')}
      onChange={(values) => updateElement({ values: values.split(',') })}
    />
  )
}

function Formula() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const formula = useStore(select(selectors.check, (check) => check.formula))
  return (
    <InputField
      label="Formula"
      value={formula || ''}
      onChange={(formula) => updateElement({ formula })}
    />
  )
}
