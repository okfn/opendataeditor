import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Columns'
import InputField from '../../../../Parts/Fields/Input'
import { useStore, selectors } from '../../store'
import SelectField from '../../../../Parts/Fields/Select'
import * as settings from '../../settings'

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
  const transform = useStore(selectors.transform!)
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="Field"
      value={transform?.aggregate?.field!}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/aggregateField')}
      onChange={(value) => {
        let aggregate = {}
        if (transform.aggregate && transform.aggregate.length > 0) {
          aggregate = transform.aggregate[0]
        }
        updateTransform({ aggregate: [{ ...aggregate, field: value }] })
      }}
    />
  )
}

function Operation() {
  const transform = useStore(selectors.transform!)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      label="Op"
      margin="none"
      value={transform?.aggregate?.op!}
      options={settings.CHANNEL_AGGREGATES}
      onFocus={() => updateHelp('transforms/aggregateOperation')}
      onChange={(value) => {
        let aggregate = {}
        if (transform.aggregate && transform.aggregate.length > 0) {
          aggregate = transform.aggregate[0]
        }
        updateTransform({ aggregate: [{ ...aggregate, op: value }] })
      }}
    />
  )
}

function As() {
  const transform = useStore(selectors.transform!)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="As"
      value={transform?.aggregate?.value!}
      onFocus={() => updateHelp('transforms/aggregateAs')}
      onChange={(value) => {
        let aggregate = {}
        if (transform.aggregate && transform.aggregate.length > 0) {
          aggregate = transform.aggregate[0]
        }
        updateTransform({ aggregate: [{ ...aggregate, as: value }] })
      }}
    />
  )
}

function GroupBy() {
  const transform = useStore(selectors.transform!)
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="GroupBy"
      value={transform?.aggregate?.field!}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/aggregateField')}
      onChange={(value) => {
        updateTransform({ groupBy: [value] })
      }}
    />
  )
}
