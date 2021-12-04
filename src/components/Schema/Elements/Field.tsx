import * as React from 'react'
import { createSelector } from 'reselect'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import InputField from '../../Library/Fields/InputField'
import YesNoField from '../../Library/Fields/YesNoField'
import SelectField from '../../Library/Fields/SelectField'
import ValuesField from '../../Library/Fields/ValuesField'
import MultilineField from '../../Library/Fields/MultilineField'
import DescriptorField from '../../Library/Fields/DescriptorField'
import * as settings from '../../../settings'
import { useStore, selectors } from '../store'

export default function Field() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)

  // Components

  const Field = () => (
    <Columns spacing={3}>
      <Box>
        <Name />
        <Columns spacing={1}>
          <Type />
          <Format />
        </Columns>
        <Title />
        <Description />
      </Box>
      <Box>
        <MissingValues />
        <RdfType />
        <Extras />
      </Box>
    </Columns>
  )

  const MissingValues = () => (
    <ValuesField
      type="missing"
      values={field.missingValues || []}
      options={settings.MISSING_VALUES}
      onChange={(missingValues) => updateField({ missingValues })}
    />
  )

  const RdfType = () => (
    <InputField
      label="RDF Type"
      value={field.rdfType || ''}
      onChange={(rdfType) => updateField({ rdfType })}
    />
  )

  const Extras = () => {
    switch (field.type) {
      case 'array':
        return <ArrayExtras />
      case 'boolean':
        return <BooleanExtras />
      case 'integer':
        return <IntegerExtras />
      case 'number':
        return <NumberExtras />
      default:
        return null
    }
  }

  const ArrayExtras = () => (
    <React.Fragment>
      <ArrayItem />
    </React.Fragment>
  )

  const BooleanExtras = () => (
    <React.Fragment>
      <TrueValues />
      <FalseValues />
    </React.Fragment>
  )

  const IntegerExtras = () => (
    <React.Fragment>
      <BareNumber />
      <GroupChar />
    </React.Fragment>
  )

  const NumberExtras = () => (
    <React.Fragment>
      <Columns spacing={1}>
        <BareNumber />
        <GroupChar />
      </Columns>
      <Columns spacing={1}>
        <FloatNumber />
        <DecimalChar />
      </Columns>
    </React.Fragment>
  )

  const ArrayItem = () => (
    <DescriptorField
      type="yaml"
      label="Array Item"
      value={field.arrayItem}
      onChange={(arrayItem) => updateField({ arrayItem })}
    />
  )

  // TODO: add values enabled by default?
  const TrueValues = () => (
    <ValuesField
      type="true"
      values={field.trueValues || []}
      options={settings.TRUE_VALUES}
      onChange={(trueValues) => updateField({ trueValues })}
    />
  )

  // TODO: add values enabled by default?
  const FalseValues = () => (
    <ValuesField
      type="false"
      values={field.falseValues || []}
      options={settings.FALSE_VALUES}
      onChange={(falseValues) => updateField({ falseValues })}
    />
  )

  const BareNumber = () => (
    <YesNoField
      label="Bare Number"
      value={field.bareNumber || settings.DEFAULT_BARE_NUMBER}
      onChange={(bareNumber) => updateField({ bareNumber })}
    />
  )

  const FloatNumber = () => (
    <YesNoField
      label="Float Number"
      value={field.floatNumber || false}
      onChange={(floatNumber) => updateField({ floatNumber })}
    />
  )

  const DecimalChar = () => (
    <InputField
      label="Decimal Char"
      value={field.decimalChar || settings.DEFAULT_DECIMAL_CHAR}
      onChange={(decimalChar) => updateField({ decimalChar })}
    />
  )

  const GroupChar = () => (
    <InputField
      label="Group Char"
      value={field.groupChar || settings.DEFAULT_GROUP_CHAR}
      onChange={(groupChar) => updateField({ groupChar })}
    />
  )

  return <Field />
}

function Name() {
  const updateField = useStore((state) => state.updateField)
  const name = useStore(createSelector(selectors.field, (field) => field.name))
  return (
    <InputField label="Name" value={name} onChange={(name) => updateField({ name })} />
  )
}

function Type() {
  const updateField = useStore((state) => state.updateField)
  const type = useStore(createSelector(selectors.field, (field) => field.type))
  return (
    <SelectField
      label="Type"
      value={type}
      options={Object.keys(settings.FIELDS)}
      onChange={(type) => updateField({ type })}
    />
  )
}

function Format() {
  const updateField = useStore((state) => state.updateField)
  const format = useStore(createSelector(selectors.field, (field) => field.format))
  const type = useStore(createSelector(selectors.field, (field) => field.type))
  const FIELD = (settings.FIELDS as any)[type]
  const isFree = FIELD.formats.includes('*')
  return isFree ? (
    <InputField
      label="Format"
      value={format}
      onChange={(format) => updateField({ format })}
    />
  ) : (
    <SelectField
      label="Format"
      value={format}
      options={FIELD.formats}
      onChange={(format) => updateField({ format })}
    />
  )
}

function Title() {
  const updateField = useStore((state) => state.updateField)
  const title = useStore(createSelector(selectors.field, (field) => field.title))
  return (
    <InputField
      label="Title"
      value={title}
      onChange={(title) => updateField({ title })}
    />
  )
}

function Description() {
  const updateField = useStore((state) => state.updateField)
  const desc = useStore(createSelector(selectors.field, (field) => field.description))
  return (
    <MultilineField
      label="Description"
      value={desc || ''}
      onChange={(description) => updateField({ description })}
    />
  )
}
