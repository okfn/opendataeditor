import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../../store'
import Columns from '../../../../Parts/Grids/Columns'
import InputField from '../../../../Parts/Fields/Input'
import SelectField from '../../../../Parts/Fields/Select'
import * as types from '../../../../../types'
import * as settings from '../../settings'

export default function Stack() {
  return (
    <React.Fragment>
      <Columns spacing={3}>
        <Box>
          <Field />
          <Offset />
          <SortOrder />
        </Box>
        <Box>
          <As />
          <GroupBy />
          <SortField />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function Field() {
  const transform = useStore(selectors.transform!) as types.IStack
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="Stack"
      value={transform?.stack ?? ''}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/stackField')}
      onChange={(value) => {
        updateTransform({ ...transform, stack: value })
      }}
    />
  )
}

function Offset() {
  const transform = useStore(selectors.transform!) as types.IStack
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="Offset"
      value={transform?.offset ?? ''}
      options={settings.STACK_OFFSETS}
      onFocus={() => updateHelp('transforms/stackOffset')}
      onChange={(value) => {
        updateTransform({ ...transform, offset: value })
      }}
    />
  )
}

function SortOrder() {
  const transform = useStore(selectors.transform!) as types.IStack
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const sort = transform.sort && transform.sort.length > 0 ? transform.sort[0] : undefined
  return (
    <SelectField
      label="Sort Order"
      value={sort?.order ?? ''}
      options={settings.SORT_TYPES}
      onFocus={() => updateHelp('channels/stackSortOrder')}
      onChange={(value) => {
        const field = sort ? sort.field : ''
        updateTransform({
          ...transform,
          sort: [{ field, order: value }],
        })
      }}
    />
  )
}

function As() {
  const transform = useStore(selectors.transform!) as types.IStack
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="As"
      value={transform?.as ?? ''}
      onFocus={() => updateHelp('transforms/stackAs')}
      onChange={(value) => {
        updateTransform({ ...transform, as: value.split(',') })
      }}
    />
  )
}

function GroupBy() {
  const transform = useStore(selectors.transform!) as types.IStack
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="GroupBy"
      value={(transform?.groupby || []).join()}
      onFocus={() => updateHelp('transforms/stackGroupBy')}
      onChange={(value) => {
        updateTransform({ groupby: value.split(',') })
      }}
    />
  )
}

function SortField() {
  const transform = useStore(selectors.transform!) as types.IStack
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const sort = transform.sort && transform.sort.length > 0 ? transform.sort[0] : undefined
  return (
    <SelectField
      label="Sort By Field"
      options={fieldNames}
      value={sort?.field ?? ''}
      onFocus={() => updateHelp('transforms/stackSortByField')}
      onChange={(value) => {
        const order = sort ? sort.order : ''
        updateTransform({
          ...transform,
          sort: [{ field: value, order }],
        })
      }}
    />
  )
}
