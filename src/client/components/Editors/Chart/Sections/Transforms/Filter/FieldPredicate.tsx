import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../../Parts/Grids/Columns'
import InputField from '../../../../../Parts/Fields/Input'
import { useStore, selectors } from '../../../store'
import SelectField from '../../../../../Parts/Fields/Select'
import * as settings from '../../../settings'
import * as types from '../../../../../../types'

export default function FieldPredicate() {
  return (
    <Columns spacing={3}>
      <Box>
        <TimeUnit />
        <Predicate />
      </Box>
      <Box>
        <Field />
        <PredicateValue />
      </Box>
    </Columns>
  )
}

function TimeUnit() {
  const transform = useStore(selectors.transform!) as types.IFieldPredicate
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="TimeUnit"
      value={transform?.filter?.timeUnit ?? ''}
      options={settings.TIME_UNITS}
      onFocus={() => updateHelp('transforms/filterFieldPredicateTimeUnit')}
      onChange={(value) => {
        updateTransform({ filter: { ...transform.filter, timeUnit: value } })
      }}
    />
  )
}

function Field() {
  const transform = useStore(selectors.transform!) as types.IFieldPredicate
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="Field"
      value={transform?.filter?.field ?? ''}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/filterFieldPredicateField')}
      onChange={(value) => {
        updateTransform({ filter: { ...transform.filter, field: value } })
      }}
    />
  )
}

function Predicate() {
  const transform = useStore(selectors.transform!) as types.IFieldPredicate
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const predicate = useStore(selectors.filterPredicate)
  return (
    <SelectField
      label="Predicate"
      value={predicate}
      options={settings.FIELD_PREDICATES}
      onFocus={() => updateHelp('transforms/filterFieldPredicate')}
      onChange={(value) => {
        delete transform.filter[predicate]
        transform.filter[value] = ''
        updateTransform({ filter: { ...transform.filter } })
      }}
    />
  )
}

function PredicateValue() {
  const transform = useStore(selectors.transform!) as types.IFieldPredicate
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const predicate = useStore(selectors.filterPredicate)
  const value =
    transform.filter && transform.filter[predicate] ? transform.filter[predicate] : ''
  return (
    <InputField
      label="Predicate Value"
      value={value}
      onFocus={() => updateHelp('transforms/filterFieldPredicateValue')}
      onChange={(value) => {
        transform.filter[predicate] = value
        updateTransform({ filter: { ...transform.filter } })
      }}
    />
  )
}
