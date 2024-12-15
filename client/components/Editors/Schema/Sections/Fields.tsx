import * as React from 'react'
import partition from 'lodash/partition'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import EditorSearch from '../../Base/Search'
import InputField from '../../../Parts/Fields/Input'
import YesNoField from '../../../Parts/Fields/YesNo'
import SelectField from '../../../Parts/Fields/Select'
import MultilineField from '../../../Parts/Fields/Multiline'
import DescriptorField from '../../../Parts/Fields/Descriptor'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'
import DatePickerField from '../../../Parts/Fields/DatePicker'
import DateTimePickerField from '../../../Parts/Fields/DateTimePicker'
import TimePickerField from '../../../Parts/Fields/TimePicker'
import validator from 'validator'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import EditorHelp from '../../Base/Help'

export default function Fields() {
  const index = useStore((state) => state.fieldState.index)
  return index === undefined ? <FieldList /> : <FieldItem />
}

function FieldList() {
  const query = useStore((state) => state.fieldState.query)
  const fieldItems = useStore(selectors.fieldItems)
  const updateFieldState = useStore((state) => state.updateFieldState)

  return (
    <EditorList
      kind="field"
      query={query}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateFieldState({ query })}
        />
      }
    >
      {fieldItems.map(({ index, field }) => (
        <EditorListItem
          key={index}
          kind="field"
          name={field.name}
          type={field.type}
          onClick={() => updateFieldState({ index })}
        />
      ))}
    </EditorList>
  )
}

function FieldItem() {
  const name = useStore(select(selectors.field, (field) => field.name))
  const isExtras = useStore((state) => state.fieldState.isExtras)
  const updateFieldState = useStore((state) => state.updateFieldState)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()
  return (
    <EditorItem
      kind="field"
      name={name}
      isExtras={isExtras}
      extrasName={t('constraints')}
      onExtrasClick={() => updateFieldState({ isExtras: !isExtras })}
      onBackClick={() => updateFieldState({ index: undefined, isExtras: false })}
    >
      <EditorHelp helpItem={helpItem} withIcon />
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
  const name = useStore(select(selectors.field, (field) => field.name))
  const index = useStore((state) => state.fieldState.index)
  const descriptor = useStore((state) => state.descriptor)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateField = useStore((state) => state.updateField)

  const [value, setValue] = React.useState('')
  const { t } = useTranslation()

  React.useEffect(() => {
    setValue(name)
  }, [descriptor])

  const handleChange = (value: string) => {
    setValue(value)
    const name = value || `field${index}`
    updateField({ name })
  }

  return (
    <InputField
      disabled
      label={t('name')}
      value={value}
      error={!value}
      onFocus={() => updateHelp('schema/fields/name')}
      onChange={handleChange}
    />
  )
}

function Type() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const type = useStore(select(selectors.field, (field) => field.type))
  const { t } = useTranslation()
  return (
    <SelectField
      label={t('type')}
      value={type}
      options={Object.keys(settings.FIELDS)}
      onFocus={() => updateHelp('schema/fields/type')}
      onChange={(value) => updateField({ type: value })}
    />
  )
}

function Format() {
  const updateField = useStore((state) => state.updateField)
  const format = useStore(select(selectors.field, (field) => field.format))
  const type = useStore(select(selectors.field, (field) => field.type))
  const updateHelp = useStore((state) => state.updateHelp)
  // TODO: remove any
  const FIELD = (settings.FIELDS as any)[type]
  const isFree = FIELD.formats.includes('*')
  const { t } = useTranslation()
  return isFree ? (
    <InputField
      label={t('format')}
      value={format || ''}
      onFocus={() => updateHelp('schema/fields/format')}
      onChange={(value) => updateField({ format: value || undefined })}
    />
  ) : (
    <SelectField
      label={t('format')}
      value={format || ''}
      options={FIELD.formats}
      onFocus={() => updateHelp('schema/field/format')}
      onChange={(value) => updateField({ format: value || undefined })}
    />
  )
}

function Title() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const title = useStore(select(selectors.field, (field) => field.title))
  const { t } = useTranslation()
  return (
    <InputField
      label={t('title')}
      value={title || ''}
      onFocus={() => updateHelp('schema/fields/title')}
      onChange={(value) => updateField({ title: value || undefined })}
    />
  )
}

function Description() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const descriptor = useStore(select(selectors.field, (field) => field.description))
  const { t } = useTranslation()
  return (
    <MultilineField
      label={t('description')}
      value={descriptor || ''}
      onFocus={() => updateHelp('schema/fields/description')}
      onChange={(value) => updateField({ description: value || undefined })}
    />
  )
}

function MissingValues() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const missingValues = useStore(select(selectors.field, (field) => field.missingValues))
  const { t } = useTranslation()
  return (
    <InputField
      label={t('missing-values')}
      value={(missingValues || []).join(',')}
      onFocus={() => updateHelp('schema/fields/missingValues')}
      onChange={(value) =>
        updateField({ missingValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function RdfType() {
  const updateField = useStore((state) => state.updateField)
  const updateHelp = useStore((state) => state.updateHelp)
  const rdfType = useStore(select(selectors.field, (field) => field.rdfType))
  const { t } = useTranslation()
  return (
    <InputField
      label={t('rdf-type')}
      value={rdfType || ''}
      onFocus={() => updateHelp('schema/fields/rdfType')}
      onChange={(value) => updateField({ rdfType: value || undefined })}
    />
  )
}

function TypeSpecific() {
  const type = useStore(select(selectors.field, (field) => field.type))
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
  const arrayItem = useStore(select(selectors.field, (field) => field.arrayItem))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <DescriptorField
      type="yaml"
      label={t('array-item')}
      value={arrayItem}
      onFocus={() => updateHelp('schema/fields/arrayItem')}
      onChange={(value) => updateField({ arrayItem: value || undefined })}
    />
  )
}

function TrueValues() {
  const updateField = useStore((state) => state.updateField)
  const trueValues = useStore(select(selectors.field, (field) => field.trueValues))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('true-values')}
      value={(trueValues || []).join(',')}
      onFocus={() => updateHelp('schema/fields/trueValues')}
      onChange={(value) =>
        updateField({ trueValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function FalseValues() {
  const updateField = useStore((state) => state.updateField)
  const falseValues = useStore(select(selectors.field, (field) => field.falseValues))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('false-values')}
      value={(falseValues || []).join(',')}
      onFocus={() => updateHelp('schema/fields/falseValues')}
      onChange={(value) =>
        updateField({ falseValues: value ? value.split(',') : undefined })
      }
    />
  )
}

function BareNumber() {
  const updateField = useStore((state) => state.updateField)
  const bareNumber = useStore(select(selectors.field, (field) => field.bareNumber))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <YesNoField
      label={t('bare-number')}
      value={bareNumber || settings.DEFAULT_BARE_NUMBER}
      onFocus={() => updateHelp('schema/fields/bareNumber')}
      onChange={(value) =>
        updateField({ bareNumber: value === false ? value : undefined })
      }
    />
  )
}

function FloatNumber() {
  const updateField = useStore((state) => state.updateField)
  const floatNumber = useStore(select(selectors.field, (field) => field.floatNumber))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <YesNoField
      label={t('float-number')}
      value={floatNumber || false}
      onFocus={() => updateHelp('schema/fields/floatNumber')}
      onChange={(value) => updateField({ floatNumber: value || undefined })}
    />
  )
}

function DecimalChar() {
  const updateField = useStore((state) => state.updateField)
  const decimalChar = useStore(select(selectors.field, (field) => field.decimalChar))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('decimal-char')}
      onFocus={() => updateHelp('schema/fields/decimalChar')}
      value={decimalChar || settings.DEFAULT_DECIMAL_CHAR}
      onChange={(value) => updateField({ decimalChar: value || undefined })}
    />
  )
}

function GroupChar() {
  const updateField = useStore((state) => state.updateField)
  const groupChar = useStore(select(selectors.field, (field) => field.groupChar))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('group-char')}
      onFocus={() => updateHelp('schema/fields/groupChar')}
      value={groupChar || settings.DEFAULT_GROUP_CHAR}
      onChange={(value) => updateField({ groupChar: value || undefined })}
    />
  )
}

function FieldItemExtras() {
  const field = useStore(selectors.field)
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
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()

  return (
    <YesNoField
      label={t('required')}
      onFocus={() => updateHelp('schema/fields/required')}
      value={constraints?.required || false}
      onChange={(value) => {
        const required = value || undefined
        updateField({ constraints: { ...constraints, required } })
      }}
    />
  )
}

function Minimum() {
  const type = useStore(select(selectors.field, (field) => field.type))
  switch (type) {
    case 'date':
      return <MinimumDate />
    case 'datetime':
      return <MinimumDateTime />
    case 'time':
      return <MinimumTime />
    default:
      return <MinimumNumber />
  }
}

function Maximum() {
  const type = useStore(select(selectors.field, (field) => field.type))
  switch (type) {
    case 'date':
      return <MaximumDate />
    case 'datetime':
      return <MaximumDateTime />
    case 'time':
      return <MaximumTime />
    default:
      return <MaximumNumber />
  }
}

function MinimumDate() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATE_FORMAT
  const value = constraints ? dayjs(constraints.minimum, format) : null
  const { t } = useTranslation()
  return (
    <DatePickerField
      label={t('minimum')}
      value={value}
      onFocus={() => updateHelp('schema/fields/minimum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, minimum: value.format(format) } })
      }}
      errorMessage={'Minimum value is not valid'}
    />
  )
}

function MaximumDate() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATE_FORMAT
  const value = constraints ? dayjs(constraints.maximum, format) : null
  const { t } = useTranslation()
  return (
    <DatePickerField
      label={t('maximum')}
      value={value}
      onFocus={() => updateHelp('schema/fields/maximum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, maximum: value.format(format) } })
      }}
      errorMessage={'Maximum value is not valid'}
    />
  )
}

function MinimumDateTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATETIME_FORMAT
  const value = constraints ? dayjs(constraints.minimum, format) : null
  const { t } = useTranslation()
  return (
    <DateTimePickerField
      label={t('minimum')}
      value={value}
      onFocus={() => updateHelp('schema/fields/minimum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, minimum: value.format(format) } })
      }}
      errorMessage={t('minimum-not-valid')}
    />
  )
}

function MaximumDateTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_DATETIME_FORMAT
  const value = constraints ? dayjs(constraints.maximum, format) : null
  const { t } = useTranslation()
  return (
    <DateTimePickerField
      label={t('maximum')}
      value={value}
      onFocus={() => updateHelp('schema/fields/maximum')}
      onChange={(value) => {
        if (!value) return
        updateField({ constraints: { ...constraints, maximum: value.format(format) } })
      }}
      errorMessage={t('maximum-not-valid')}
    />
  )
}

function MinimumTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_TIME_FORMAT
  const value = constraints ? dayjs(constraints.minimum, format) : null
  const { t } = useTranslation()
  return (
    <TimePickerField
      label={t('minimum')}
      value={value}
      onFocus={() => updateHelp('schema/fields/minimum')}
      onChange={(value) => {
        if (!value) return
        updateField({
          constraints: {
            ...constraints,
            minimum: value.format(format),
          },
        })
      }}
      errorMessage={t('minimum-not-valid')}
    />
  )
}

function MaximumTime() {
  const field = useStore(selectors.field)
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const format = field.format || settings.DEFUALT_TIME_FORMAT
  const value = constraints ? dayjs(constraints.maximum, format) : null
  const { t } = useTranslation()
  return (
    <TimePickerField
      label={t('maximum')}
      value={value}
      onFocus={() => updateHelp('schema/fields/maximum')}
      onChange={(value) => {
        if (!value) return
        updateField({
          constraints: {
            ...constraints,
            maximum: value.format(format),
          },
        })
      }}
      errorMessage={t('maximum-not-valid')}
    />
  )
}

function MinimumNumber() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const [isValid, setIsValid] = React.useState(isValidMinimumNumber())
  const { t } = useTranslation()

  function isValidMinimumNumber() {
    if (!constraints) return true
    return constraints.minimum
      ? validator.isNumeric(constraints.minimum.toString())
      : true
  }

  return (
    <InputField
      error={!isValid}
      type="number"
      label={t('minimum')}
      value={constraints?.minimum || ''}
      onFocus={() => updateHelp('schema/fields/minimum')}
      onBlur={() => {
        setIsValid(isValidMinimumNumber())
      }}
      onChange={(value) => {
        const minimum = value || undefined
        updateField({ constraints: { ...constraints, minimum } })
      }}
      helperText={!isValid ? t('minimum-not-valid') : ''}
    />
  )
}

function MaximumNumber() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const [isValid, setIsValid] = React.useState(isValidMaximumNumber())
  const { t } = useTranslation()

  function isValidMaximumNumber() {
    if (!constraints) return true
    return constraints.maximum
      ? validator.isNumeric(constraints.maximum.toString())
      : true
  }

  return (
    <InputField
      error={!isValid}
      type="number"
      label={t('maximum')}
      value={constraints?.maximum || ''}
      onFocus={() => updateHelp('schema/fields/maximum')}
      onBlur={() => {
        setIsValid(isValidMaximumNumber())
      }}
      onChange={(value) => {
        const maximum = value || undefined
        updateField({ constraints: { ...constraints, maximum } })
      }}
      helperText={!isValid ? t('maximum-not-valid') : ''}
    />
  )
}

function MinLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()

  return (
    <InputField
      type="integer"
      label={t('min-length')}
      value={constraints?.minLength || ''}
      onFocus={() => updateHelp('schema/fields/minLength')}
      onChange={(value) => {
        const minLength = value ? parseInt(value) : undefined
        updateField({ constraints: { ...constraints, minLength } })
      }}
    />
  )
}

function MaxLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()

  return (
    <InputField
      type="integer"
      label={t('max-length')}
      value={constraints?.maxLength || ''}
      onFocus={() => updateHelp('schema/fields/maxLength')}
      onChange={(value) => {
        const maxLength = value ? parseInt(value) : undefined
        updateField({ constraints: { ...constraints, maxLength } })
      }}
    />
  )
}

function Pattern() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()

  return (
    <InputField
      type="string"
      label={t('pattern')}
      value={constraints?.pattern || ''}
      onFocus={() => updateHelp('schema/fields/pattern')}
      onChange={(value) => {
        const pattern = value || undefined
        updateField({ constraints: { ...constraints, pattern } })
      }}
    />
  )
}

function Enum() {
  const updateField = useStore((state) => state.updateField)
  const descriptor = useStore((state) => state.descriptor)
  const constraints = useStore(select(selectors.field, (field) => field.constraints))
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()

  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    const initialValue = constraints?.enum?.join(', ') || ''
    setValue(initialValue)
  }, [descriptor])

  const handleChange = (value: string) => {
    setValue(value)
    const items = value.split(',').map((v) => v.trim())
    const enumValue = items.some(Boolean) ? items : undefined
    updateField({ constraints: { ...constraints, enum: enumValue } })
  }

  return (
    <InputField
      type="string"
      label={t('enum')}
      value={value}
      onFocus={() => updateHelp('schema/fields/enum')}
      onChange={handleChange}
    />
  )
}
