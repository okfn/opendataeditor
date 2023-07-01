import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../../store'
import InputField from '../../../../Parts/Fields/Input'
import Columns from '../../../../Parts/Grids/Columns'
import SelectField from '../../../../Parts/Fields/Select'
import * as settings from '../../settings'

export default function Sorting() {
  return (
    <Columns spacing={3}>
      <Box>
        <SortOrder />
        <Operation />
      </Box>
      <Box>
        <SortByEncoding />
        <Field />
      </Box>
    </Columns>
  )
}

function SortOrder() {
  const sort = useStore(selectors.channelActiveInputValue('sort'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const order = typeof sort === 'string' ? sort : ''
  return (
    <SelectField
      label="Sort Order"
      value={order}
      options={settings.SORT_TYPES}
      onFocus={() => updateHelp('channel/aggregate')}
      onChange={(value) => updateChannel({ sort: value })}
    />
  )
}

function SortByEncoding() {
  const sort = useStore(selectors.channelActiveInputValue('sort'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  const order = typeof sort === 'string' ? sort : ''
  return (
    <InputField
      label="Sort Order by Encoding"
      value={order}
      onFocus={() => {
        updateHelp('channel/sortTitle')
        updateChannelState({ activeInput: 'sort' })
      }}
      onChange={(value) => updateChannel({ sort: value })}
    />
  )
}

function Operation() {
  const sort = useStore(selectors.channelActiveInputValue('sort'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  const operation = typeof sort === 'object' ? sort?.operation : ''
  return (
    <InputField
      label="Operation"
      value={operation ?? ''}
      onFocus={() => {
        updateHelp('channel/sortOperation')
        updateChannelState({ activeInput: 'sort' })
      }}
      onChange={(value) => {
        updateChannel({ sort: { ...sort, op: value } })
      }}
    />
  )
}

function Field() {
  const sort = useStore(selectors.channelActiveInputValue('sort'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  const field = typeof sort === 'object' ? sort?.field : ''
  return (
    <InputField
      label="Field"
      value={field ?? ''}
      onFocus={() => {
        updateHelp('channel/sortField')
        updateChannelState({ activeInput: 'sort' })
      }}
      onChange={(value) => {
        updateChannel({ sort: { ...sort, field: value } })
      }}
    />
  )
}
