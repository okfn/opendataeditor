import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../../store'
import Columns from '../../../../Parts/Columns'
import InputField from '../../../../Parts/Fields/Input'
import SelectField from '../../../../Parts/Fields/Select'
import { IStack } from '../../../../../interfaces'
import * as settings from '../../settings'

export default function Stack() {
  return (
    <React.Fragment>
      <Columns spacing={3}>
        <Box>
          <StackField />
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

function StackField() {
  const transform = useStore(selectors.transform!) as IStack
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="Stack"
      value={transform?.stack ?? ''}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/stackOffset')}
      onChange={(value) => {
        updateTransform({ ...transform, stack: value })
      }}
    />
  )
}

function Offset() {
  const transform = useStore(selectors.transform!) as IStack
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

function As() {
  const transform = useStore(selectors.transform!) as IStack
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
  const transform = useStore(selectors.transform!) as IStack
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      label="GroupBy"
      value={transform?.groupby ?? ''}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/stackGroupBy')}
      onChange={(value) => {
        updateTransform({ ...transform, groupby: [value] })
      }}
    />
  )
}

function SortField() {
  const transform = useStore(selectors.transform!) as IStack
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
          sort: [{ field: value, order: order }],
        })
      }}
    />
  )
}

function SortOrder() {
  const transform = useStore(selectors.transform!) as IStack
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  const sort = transform.sort && transform.sort.length > 0 ? transform.sort[0] : undefined
  return (
    <SelectField
      label="Sort Order"
      value={sort?.order ?? ''}
      options={settings.SORT_TYPES}
      onFocus={() => updateHelp('channels/aggregate')}
      onChange={(value) => {
        const field = sort ? sort.field : ''
        updateTransform({
          ...transform,
          sort: [{ field: field, order: value }],
        })
      }}
    />
  )
}
