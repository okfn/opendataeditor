import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import InputField from '../../../../Parts/Fields/Input'
import { useStore, selectors } from '../../store'
import SelectField from '../../../../Parts/Fields/Select'
import * as settings from '../../settings'
import * as types from '../../../../../types'

export default function Aggregate() {
  return (
    <Columns spacing={3}>
      <Box>
        <Field />
        <As />
      </Box>
      <Box>
        <Operation />
        <GroupBy />
      </Box>
    </Columns>
  )
}

function Field() {
  const transform = useStore(selectors.transform!) as types.IAggregate
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const aggregate =
    transform.aggregate && transform.aggregate.length > 0
      ? transform.aggregate[0]
      : undefined
  return (
    <SelectField
      focused
      label="Field"
      value={aggregate?.field ?? ''}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/aggregateField')}
      onChange={(value) => {
        updateTransform({ aggregate: [{ ...aggregate, field: value }] })
      }}
    />
  )
}

function Operation() {
  const transform = useStore(selectors.transform!) as types.IAggregate
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const aggregate =
    transform.aggregate && transform.aggregate.length > 0
      ? transform.aggregate[0]
      : undefined
  return (
    <SelectField
      focused
      label="Operation"
      value={aggregate?.op ?? ''}
      options={settings.CHANNEL_AGGREGATES}
      onFocus={() => updateHelp('transforms/aggregateOperation')}
      onChange={(value) => {
        updateTransform({ aggregate: [{ ...aggregate, op: value }] })
      }}
    />
  )
}

function As() {
  const transform = useStore(selectors.transform!) as types.IAggregate
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const customFields = useStore((state) => state.customFields)
  const updateState = useStore((state) => state.updateState)
  const aggregate =
    transform.aggregate && transform.aggregate.length > 0
      ? transform.aggregate[0]
      : undefined
  return (
    <InputField
      label="As"
      value={aggregate?.as ?? ''}
      onFocus={() => updateHelp('transforms/aggregateAs')}
      onChange={(value) => {
        updateTransform({ aggregate: [{ ...aggregate, as: value }] })
      }}
      onBlur={() => {
        if (!aggregate?.as) {
          const newList = customFields.filter((field) => field !== aggregate?.as)
          updateState({ customFields: newList })
          return
        }
        if (aggregate?.as && !customFields.includes(aggregate.as)) {
          customFields.push(aggregate.as)
        }
        updateState({ customFields })
      }}
    />
  )
}

function GroupBy() {
  const transform = useStore(selectors.transform!) as types.IAggregate
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="GroupBy"
      value={(transform?.groupby || []).join()}
      onFocus={() => updateHelp('transforms/aggregateGroupBy')}
      onChange={(value) => {
        updateTransform({ groupby: value.split(',') })
      }}
    />
  )
}
