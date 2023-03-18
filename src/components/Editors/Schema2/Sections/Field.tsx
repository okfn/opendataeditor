import * as React from 'react'
import partition from 'lodash/partition'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import InputField from '../../../Parts/Fields/InputField'
import YesNoField from '../../../Parts/Fields/YesNoField'
import SelectField from '../../../Parts/Fields/SelectField'
import ValuesField from '../../../Parts/Fields/ValuesField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import DescriptorField from '../../../Parts/Fields/DescriptorField'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'

export default function Field() {
  const index = useStore((state) => state.fieldState.index)
  return index === undefined ? <FieldList /> : <FieldItem />
}

function FieldList() {
  const isGrid = useStore((state) => state.fieldState.isGrid)
  const query = useStore((state) => state.fieldState.query)
  const foundFieldItems = useStore(selectors.foundFieldItems)
  const updateFieldState = useStore((state) => state.updateFieldState)
  const addField = useStore((state) => state.addField)
  return (
    <EditorList
      kind="field"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addField()}
      onGridClick={() => updateFieldState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateFieldState({ query })}
        />
      }
    >
      {foundFieldItems.map(({ index, field }) => (
        <EditorListItem
          key={index}
          index={index}
          kind="field"
          name={field.name}
          type={field.type}
          isGrid={isGrid}
          onClick={() => updateFieldState({ index })}
          title="View Field"
        />
      ))}
    </EditorList>
  )
}

function FieldItem() {
  const name = useStore(select(selectors.field, ({ field }) => field.name))
  const isExtras = useStore((state) => state.fieldState.isExtras)
  const removeField = useStore((state) => state.removeField)
  const updateFieldState = useStore((state) => state.updateFieldState)
  return (
    <EditorItem
      kind="field"
      name={name}
      isExtras={isExtras}
      extrasName="constraints"
      onExtrasClick={() => updateFieldState({ isExtras: !isExtras })}
      onRemoveClick={() => removeField()}
      onBackClick={() => updateFieldState({ index: undefined, isExtras: false })}
    >
      {isExtras ? <FieldItemExtras /> : <FieldItemMain />}
    </EditorItem>
  )
}

function FieldItemMain() {
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
        <TypeSpecific />
      </Box>
    </Columns>
  )
}

function Name() {
  const name = useStore(select(selectors.field, ({ field }) => field.name))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateField = useStore((state) => state.updateField)
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('schema/fields/name')}
      onChange={(value) => updateField({ name: value || undefined })}
    />
  )
}

function Type() {
  const updateField = useStore((state) => state.updateField)
  const type = useStore(select(selectors.field, ({ field }) => field.type))
  return (
    <SelectField
      label="Type"
      value={type}
      options={Object.keys(settings.FIELDS)}
      onChange={(value) => updateField({ type: value })}
    />
  )
}

function Format() {
  const updateField = useStore((state) => state.updateField)
  const format = useStore(select(selectors.field, ({ field }) => field.format))
  const type = useStore(select(selectors.field, ({ field }) => field.type))
  // TODO: remove any
  const FIELD = (settings.FIELDS as any)[type]
  const isFree = FIELD.formats.includes('*')
  return isFree ? (
    <InputField
      label="Format"
      value={format || ''}
      onChange={(value) => updateField({ format: value || undefined })}
    />
  ) : (
    <SelectField
      label="Format"
      value={format || ''}
      options={FIELD.formats}
      onChange={(value) => updateField({ format: value || undefined })}
    />
  )
}

function Title() {
  const updateField = useStore((state) => state.updateField)
  const title = useStore(select(selectors.field, ({ field }) => field.title))
  return (
    <InputField
      label="Title"
      value={title || ''}
      onChange={(value) => updateField({ title: value || undefined })}
    />
  )
}

function Description() {
  const updateField = useStore((state) => state.updateField)
  const descriptor = useStore(select(selectors.field, ({ field }) => field.description))
  return (
    <MultilineField
      label="Description"
      value={descriptor || ''}
      onChange={(value) => updateField({ description: value || undefined })}
    />
  )
}

function MissingValues() {
  const updateField = useStore((state) => state.updateField)
  const missingValues = useStore(
    select(selectors.field, ({ field }) => field.missingValues)
  )
  return (
    <InputField
      label="Missing Values"
      value={(missingValues || []).join(',')}
      onChange={(value) =>
        updateField({ missingValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function RdfType() {
  const updateField = useStore((state) => state.updateField)
  const rdfType = useStore(select(selectors.field, ({ field }) => field.rdfType))
  return (
    <InputField
      label="RDF Type"
      value={rdfType || ''}
      onChange={(value) => updateField({ rdfType: value || undefined })}
    />
  )
}

function TypeSpecific() {
  const type = useStore(select(selectors.field, ({ field }) => field.type))
  switch (type) {
    case 'array':
      return <ArraySpecific />
    case 'boolean':
      return <BooleanSpecific />
    case 'integer':
      return <IntegerSpecific />
    case 'number':
      return <NumberSpecific />
    default:
      return null
  }
}

function ArraySpecific() {
  return (
    <React.Fragment>
      <ArrayItem />
    </React.Fragment>
  )
}

function BooleanSpecific() {
  return (
    <React.Fragment>
      <TrueValues />
      <FalseValues />
    </React.Fragment>
  )
}

function IntegerSpecific() {
  return (
    <React.Fragment>
      <BareNumber />
      <GroupChar />
    </React.Fragment>
  )
}
function NumberSpecific() {
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
  const updateField = useStore((state) => state.updateField)
  const arrayItem = useStore(select(selectors.field, ({ field }) => field.arrayItem))
  return (
    <DescriptorField
      type="yaml"
      label="Array Item"
      value={arrayItem}
      onChange={(value) => updateField({ arrayItem: value || undefined })}
    />
  )
}

function TrueValues() {
  const updateField = useStore((state) => state.updateField)
  const trueValues = useStore(select(selectors.field, ({ field }) => field.trueValues))
  return (
    <ValuesField
      type="true"
      values={trueValues || []}
      options={settings.TRUE_VALUES}
      onChange={(value) => updateField({ trueValues: value || undefined })}
    />
  )
}

function FalseValues() {
  const updateField = useStore((state) => state.updateField)
  const falseValues = useStore(select(selectors.field, ({ field }) => field.falseValues))
  return (
    <ValuesField
      type="false"
      values={falseValues || []}
      options={settings.FALSE_VALUES}
      onChange={(value) => updateField({ falseValues: value || undefined })}
    />
  )
}

function BareNumber() {
  const updateField = useStore((state) => state.updateField)
  const bareNumber = useStore(select(selectors.field, ({ field }) => field.bareNumber))
  return (
    <YesNoField
      label="Bare Number"
      value={bareNumber || settings.DEFAULT_BARE_NUMBER}
      onChange={(value) =>
        updateField({ bareNumber: value === false ? value : undefined })
      }
    />
  )
}

function FloatNumber() {
  const updateField = useStore((state) => state.updateField)
  const floatNumber = useStore(select(selectors.field, ({ field }) => field.floatNumber))
  return (
    <YesNoField
      label="Float Number"
      value={floatNumber || false}
      onChange={(value) => updateField({ floatNumber: value || undefined })}
    />
  )
}

function DecimalChar() {
  const updateField = useStore((state) => state.updateField)
  const decimalChar = useStore(select(selectors.field, ({ field }) => field.decimalChar))
  return (
    <InputField
      label="Decimal Char"
      value={decimalChar || settings.DEFAULT_DECIMAL_CHAR}
      onChange={(value) => updateField({ decimalChar: value || undefined })}
    />
  )
}

function GroupChar() {
  const updateField = useStore((state) => state.updateField)
  const groupChar = useStore(select(selectors.field, ({ field }) => field.groupChar))
  return (
    <InputField
      label="Group Char"
      value={groupChar || settings.DEFAULT_GROUP_CHAR}
      onChange={(value) => updateField({ groupChar: value || undefined })}
    />
  )
}

function FieldItemExtras() {
  const { field } = useStore(selectors.field)
  // TODO: remove any
  const FIELD = (settings.FIELDS as any)[field.type]
  const isLeft = (name: string) => !name.startsWith('m')
  const [lefts, rights] = partition(FIELD.constraints, isLeft)
  return (
    <Columns spacing={3}>
      <Box>
        {lefts.map((type: string) => (
          <Constraint key={type} type={type} />
        ))}
      </Box>
      <Box>
        {rights.map((type: string) => (
          <Constraint key={type} type={type} />
        ))}
      </Box>
    </Columns>
  )
}

function Constraint(props: { type: string }) {
  switch (props.type) {
    case 'required':
      return <Required />
    case 'enum':
      return <Enum />
    case 'minLength':
      return <MinLength />
    case 'maxLength':
      return <MaxLength />
    case 'minimum':
      return <Minimum />
    case 'maximum':
      return <Maximum />
    case 'pattern':
      return <Pattern />
    default:
      return null
  }
}

function Required() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, ({ field }) => field.constraints))
  return (
    <YesNoField
      label="Required"
      value={constraints?.required || false}
      onChange={(required) => updateField({ constraints: { ...constraints, required } })}
    />
  )
}

function Minimum() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, ({ field }) => field.constraints))
  return (
    <InputField
      type="number"
      label="Minimum"
      value={constraints?.minimum || ''}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, minimum: parseInt(value) } })
      }
    />
  )
}

function Maximum() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, ({ field }) => field.constraints))
  return (
    <InputField
      type="number"
      label="Maximum"
      value={constraints?.maximum || ''}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, maximum: parseInt(value) } })
      }
    />
  )
}

function MinLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, ({ field }) => field.constraints))
  return (
    <InputField
      type="number"
      label="Min Length"
      value={constraints?.minLength || ''}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, minLength: parseInt(value) } })
      }
    />
  )
}

function MaxLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, ({ field }) => field.constraints))
  return (
    <InputField
      type="number"
      label="Max Length"
      value={constraints?.maxLength || ''}
      onChange={(value) =>
        updateField({ constraints: { ...constraints, maxLength: parseInt(value) } })
      }
    />
  )
}

function Pattern() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, ({ field }) => field.constraints))
  return (
    <InputField
      type="string"
      label="Pattern"
      value={constraints?.pattern || ''}
      onChange={(pattern) => updateField({ constraints: { ...constraints, pattern } })}
    />
  )
}

function Enum() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, ({ field }) => field.constraints))
  return (
    <InputField
      type="string"
      label="Enum"
      value={(constraints?.enum || []).join(',')}
      onChange={(value) => updateField({ constraints: { ...constraints, enum: value } })}
    />
  )
}
