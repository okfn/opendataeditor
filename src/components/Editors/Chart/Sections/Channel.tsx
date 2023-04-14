import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import InputField from '../../../Parts/Fields/Input'
import SelectField from '../../../Parts/Fields/Select'
import { useStore, selectors, select } from '../store'
import * as settings from '../settings'

export default function Channel() {
  const type = useStore((state) => state.channelState.type)
  return type === undefined ? <ChannelList /> : <ChannelItem />
}

function ChannelList() {
  const isGrid = useStore((state) => state.channelState.isGrid)
  const query = useStore((state) => state.channelState.query)
  const channelItems = useStore(selectors.channelItems)
  const updateChannelState = useStore((state) => state.updateChannelState)
  const addChannel = useStore((state) => state.addChannel)
  const removeChannel = useStore((state) => state.removeChannel)
  return (
    <EditorList
      kind="channel"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addChannel()}
      onGridClick={() => updateChannelState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateChannelState({ query })}
        />
      }
    >
      {channelItems.map(({ type }) => (
        <EditorListItem
          key={type}
          kind="channel"
          type="channel"
          name={type}
          isGrid={isGrid}
          onClick={() => updateChannelState({ type })}
          onRemoveClick={() => removeChannel(type)}
        />
      ))}
    </EditorList>
  )
}

function ChannelItem() {
  const type = useStore((state) => state.channelState.type!)
  const isExtras = useStore((state) => state.channelState.isExtras)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <EditorItem
      kind="channel"
      name={type}
      isExtras={isExtras}
      onBackClick={() => updateChannelState({ type: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <Type />
          <Field />
        </Box>
        <Box>
          <Aggregate />
          <Value />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function Type() {
  const type = useStore((state) => state.channelState.type!)
  const updateChannelType = useStore((state) => state.updateChannelType)
  return (
    <SelectField
      label="Type"
      value={type || ''}
      options={settings.CHANNEL_TYPES}
      onChange={(value) => (value ? updateChannelType(value) : undefined)}
    />
  )
}

function Field() {
  const field = useStore(select(selectors.channel, (channel) => channel.field))
  const updateChannel = useStore((state) => state.updateChannel)
  const fieldNames = useStore(selectors.fieldNames)
  return (
    <SelectField
      label="Field"
      value={field || ''}
      options={fieldNames}
      onChange={(value) => updateChannel({ field: value })}
    />
  )
}

function Aggregate() {
  const aggregate = useStore(selectors.channelAggregate)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <SelectField
      label="Aggregate"
      value={aggregate || ''}
      options={settings.CHANNEL_AGGREGATES}
      onChange={(value) => updateChannel({ aggregate: value })}
    />
  )
}

function Value() {
  const value = useStore(selectors.channelValue)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <InputField
      label="Value"
      value={value || ''}
      onChange={(value) => updateChannel({ value: value ? parseInt(value) : undefined })}
    />
  )
}
