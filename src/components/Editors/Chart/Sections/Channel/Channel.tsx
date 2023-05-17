import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Columns'
import EditorItem from '../../../../Parts/Editor/Item'
import EditorList from '../../../../Parts/Editor/List'
import EditorListItem from '../../../../Parts/Editor/ListItem'
import EditorSearch from '../../../../Parts/Editor/Search'
import InputField from '../../../../Parts/Fields/Input'
import SelectField from '../../../../Parts/Fields/Select'
import { useStore, selectors, select } from '../../store'
import * as settings from '../../settings'
import Bin from './Bin'
import Axis from './Axis'

const PROPERTIES: { [key: string]: any } = {
  x: [Bin, Axis],
  y: [Bin, Axis],
}

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
          <ChannelTitle />
          <Stack />
        </Box>
        <Box>
          <Aggregate />
          <Value />
          <Sort />
          <FieldType />
        </Box>
      </Columns>
      {PROPERTIES[type] &&
        PROPERTIES[type].map((Item: any, index: number) => {
          return <Item key={index} />
        })}
    </EditorItem>
  )
}

function Type() {
  const type = useStore((state) => state.channelState.type!)
  const updateChannelType = useStore((state) => state.updateChannelType)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <SelectField
      label="Type"
      value={type || ''}
      options={settings.CHANNEL_TYPES}
      onFocus={() => updateHelp('channel/type')}
      onChange={(value) => (value ? updateChannelType(value) : undefined)}
    />
  )
}

function Field() {
  const field = useStore(select(selectors.channel, (channel) => channel.field))
  const updateChannel = useStore((state) => state.updateChannel)
  const fieldNames = useStore(selectors.fieldNames)
  const customFields = useStore((state) => state.customFields)
  const updateHelp = useStore((state) => state.updateHelp)
  const allFields = fieldNames.concat(customFields)
  return (
    <SelectField
      label="Field"
      value={field || ''}
      options={allFields}
      onFocus={() => updateHelp('channel/field')}
      onChange={(value) => updateChannel({ field: value })}
    />
  )
}

function ChannelTitle() {
  const title = useStore(selectors.channelActiveInputValue('title'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => {
        updateHelp('channel/title')
        updateChannelState({ activeInput: 'title' })
      }}
      onChange={(value) => updateChannel({ title: value || undefined })}
    />
  )
}

function Stack() {
  const stack = useStore(selectors.channelActiveInputValue('stack'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Stack"
      value={stack || ''}
      onFocus={() => {
        updateHelp('channel/stack')
        updateChannelState({ activeInput: 'stack' })
      }}
      onChange={(value) => updateChannel({ stack: value || undefined })}
    />
  )
}

function Aggregate() {
  const aggregate = useStore(selectors.channelAggregate)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <SelectField
      label="Aggregate"
      value={aggregate || ''}
      options={settings.CHANNEL_AGGREGATES}
      onFocus={() => updateHelp('channel/aggregate')}
      onChange={(value) => updateChannel({ aggregate: value })}
    />
  )
}

function Value() {
  const value = useStore(selectors.channelValue)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <InputField
      label="Value"
      value={value || ''}
      onFocus={() => updateHelp('channel/value')}
      onChange={(value) => updateChannel({ value: value ? parseInt(value) : undefined })}
    />
  )
}

function Sort() {
  const sort = useStore(select(selectors.channel, (channel) => channel.sort))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <SelectField
      label="Sort"
      value={sort || ''}
      options={settings.SORT_TYPES}
      onFocus={() => updateHelp('channel/aggregate')}
      onChange={(value) => updateChannel({ sort: value })}
    />
  )
}

function FieldType() {
  const type = useStore((state) => state.channelState.type!)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <SelectField
      label="Field Type"
      value={type || ''}
      options={settings.FIELD_TYPES}
      onFocus={() => updateHelp('channel/type')}
      onChange={(value) =>
        value ? updateChannel({ customFieldType: value }) : undefined
      }
    />
  )
}
