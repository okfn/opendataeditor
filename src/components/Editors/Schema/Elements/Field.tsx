import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Library/Columns'
import InputField from '../../../Library/Fields/InputField'
import YesNoField from '../../../Library/Fields/YesNoField'
import SelectField from '../../../Library/Fields/SelectField'
import ValuesField from '../../../Library/Fields/ValuesField'
import MultilineField from '../../../Library/Fields/MultilineField'
import DescriptorField from '../../../Library/Fields/DescriptorField'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'

export default function Field() {
  return (
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
}

function Name() {
  const updateElement = useStore((state) => state.updateElement)
  const name = useStore(select(selectors.field, (field) => field.name))
  return (
    <InputField label="Name" value={name} onChange={(name) => updateElement({ name })} />
  )
}

function Type() {
  const updateElement = useStore((state) => state.updateElement)
  const type = useStore(select(selectors.field, (field) => field.type))
  return (
    <SelectField
      label="Type"
      value={type}
      options={Object.keys(settings.FIELDS)}
      onChange={(type) => updateElement({ type })}
    />
  )
}

function Format() {
  const updateElement = useStore((state) => state.updateElement)
  const format = useStore(select(selectors.field, (field) => field.format))
  const type = useStore(select(selectors.field, (field) => field.type))
  // TODO: remove any
  const FIELD = (settings.FIELDS as any)[type]
  const isFree = FIELD.formats.includes('*')
  return isFree ? (
    <InputField
      label="Format"
      value={format || ''}
      onChange={(format) => updateElement({ format })}
    />
  ) : (
    <SelectField
      label="Format"
      value={format || ''}
      options={FIELD.formats}
      onChange={(format) => updateElement({ format })}
    />
  )
}

function Title() {
  const updateElement = useStore((state) => state.updateElement)
  const title = useStore(select(selectors.field, (field) => field.title))
  return (
    <InputField
      label="Title"
      value={title}
      onChange={(title) => updateElement({ title })}
    />
  )
}

function Description() {
  const updateElement = useStore((state) => state.updateElement)
  const descriptor = useStore(select(selectors.field, (field) => field.description))
  return (
    <MultilineField
      label="Description"
      value={descriptor || ''}
      onChange={(description) => updateElement({ description })}
    />
  )
}

function MissingValues() {
  const updateElement = useStore((state) => state.updateElement)
  const missingValues = useStore(select(selectors.field, (field) => field.missingValues))
  return (
    <ValuesField
      type="missing"
      values={missingValues || []}
      options={settings.MISSING_VALUES}
      onChange={(missingValues) => updateElement({ missingValues })}
    />
  )
}

function RdfType() {
  const updateElement = useStore((state) => state.updateElement)
  const rdfType = useStore(select(selectors.field, (field) => field.rdfType))
  return (
    <InputField
      label="RDF Type"
      value={rdfType || ''}
      onChange={(rdfType) => updateElement({ rdfType })}
    />
  )
}

function Extras() {
  const type = useStore(select(selectors.field, (field) => field.type))
  switch (type) {
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

function ArrayExtras() {
  return (
    <React.Fragment>
      <ArrayItem />
    </React.Fragment>
  )
}

function BooleanExtras() {
  return (
    <React.Fragment>
      <TrueValues />
      <FalseValues />
    </React.Fragment>
  )
}

function IntegerExtras() {
  return (
    <React.Fragment>
      <BareNumber />
      <GroupChar />
    </React.Fragment>
  )
}
function NumberExtras() {
  return (
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
}

function ArrayItem() {
  const updateElement = useStore((state) => state.updateElement)
  const arrayItem = useStore(select(selectors.field, (field) => field.arrayItem))
  return (
    <DescriptorField
      type="yaml"
      label="Array Item"
      value={arrayItem}
      onChange={(arrayItem) => updateElement({ arrayItem })}
    />
  )
}

function TrueValues() {
  const updateElement = useStore((state) => state.updateElement)
  const trueValues = useStore(select(selectors.field, (field) => field.trueValues))
  return (
    <ValuesField
      type="true"
      values={trueValues || []}
      options={settings.TRUE_VALUES}
      onChange={(trueValues) => updateElement({ trueValues })}
    />
  )
}

function FalseValues() {
  const updateElement = useStore((state) => state.updateElement)
  const falseValues = useStore(select(selectors.field, (field) => field.falseValues))
  return (
    <ValuesField
      type="false"
      values={falseValues || []}
      options={settings.FALSE_VALUES}
      onChange={(falseValues) => updateElement({ falseValues })}
    />
  )
}

function BareNumber() {
  const updateElement = useStore((state) => state.updateElement)
  const bareNumber = useStore(select(selectors.field, (field) => field.bareNumber))
  return (
    <YesNoField
      label="Bare Number"
      value={bareNumber || settings.DEFAULT_BARE_NUMBER}
      onChange={(bareNumber) => updateElement({ bareNumber })}
    />
  )
}

function FloatNumber() {
  const updateElement = useStore((state) => state.updateElement)
  const floatNumber = useStore(select(selectors.field, (field) => field.floatNumber))
  return (
    <YesNoField
      label="Float Number"
      value={floatNumber || false}
      onChange={(floatNumber) => updateElement({ floatNumber })}
    />
  )
}

function DecimalChar() {
  const updateElement = useStore((state) => state.updateElement)
  const decimalChar = useStore(select(selectors.field, (field) => field.decimalChar))
  return (
    <InputField
      label="Decimal Char"
      value={decimalChar || settings.DEFAULT_DECIMAL_CHAR}
      onChange={(decimalChar) => updateElement({ decimalChar })}
    />
  )
}

function GroupChar() {
  const updateElement = useStore((state) => state.updateElement)
  const groupChar = useStore(select(selectors.field, (field) => field.groupChar))
  return (
    <InputField
      label="Group Char"
      value={groupChar || settings.DEFAULT_GROUP_CHAR}
      onChange={(groupChar) => updateElement({ groupChar })}
    />
  )
}
