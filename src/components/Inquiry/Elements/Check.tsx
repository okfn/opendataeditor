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

export default function Check() {
  const code = useStore(select(selectors.check, (check) => check.code))
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
        <NumRows />
      </Box>
    </Columns>
  )
}

function NumRows() {
  const updateElement = useStore((state) => state.updateElement)
  // @ts-ignore
  const numRows = useStore(select(selectors.check, (check) => check.numRows))
  return (
    <InputField
      type="number"
      label="Exact number of rows required"
      value={numRows || ''}
      onChange={(numRows) => updateElement({ numRows })}
    />
  )
}

function Code() {
  const updateElement = useStore((state) => state.updateElement)
  const code = useStore(select(selectors.check, (check) => check.code))
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
