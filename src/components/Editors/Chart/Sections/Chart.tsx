import * as React from 'react'
// import InputField from '../../../Parts/Fields/InputField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputField from '../../../Parts/Fields/InputField'
import SelectField from '../../../Parts/Fields/SelectField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import { useStore, selectors } from '../store'

export default function Chart() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Chart" onHeadingClick={() => updateHelp('chart')}>
      <Columns spacing={3}>
        <Table />
        <Mark />
      </Columns>
      <Encoding />
    </EditorSection>
  )
}

function Table() {
  const descriptor = useStore((state) => state.descriptor)
  const url = useStore((state) => state.descriptor.data?.url)
  const tables = useStore(selectors.tables)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <SelectField
      label="Table"
      value={url || ''}
      options={Object.values(tables)}
      onFocus={() => updateHelp('chart/table')}
      onChange={(value) => {
        if (!value) return
        descriptor.data = descriptor.data || {}
        descriptor.data.url = value
        updateState({ descriptor })
      }}
    />
  )
}

function Mark() {
  const descriptor = useStore((state) => state.descriptor)
  const mark = useStore((state) => state.descriptor.mark)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <SelectField
      label="Mark"
      value={mark || ''}
      options={['bar', 'line']}
      onFocus={() => updateHelp('chart/mark')}
      onChange={(value) => {
        if (!value) return
        descriptor.mark = value
        updateState({ descriptor })
      }}
    />
  )
}

function Encoding() {
  const types = useStore((state) => Object.keys(state.descriptor.encoding || {}))
  const descriptor = useStore((state) => state.descriptor)
  const updateState = useStore((state) => state.updateState)
  React.useEffect(() => {
    if (!types.length) {
      descriptor.encoding = { x: {}, y: {} }
      updateState({ descriptor })
    }
  }, [descriptor])
  return (
    <Box>
      <Typography variant="h5">Encoding</Typography>
      {types.map((type) => (
        <EncodingItem key={type} type={type} />
      ))}
    </Box>
  )
}

function EncodingItem(props: { type: string }) {
  return (
    <Columns spacing={3}>
      <Columns spacing={1}>
        <EncodingItemType type={props.type} />
        <EncodingItemField type={props.type} />
      </Columns>
      <Columns spacing={1}>
        <EncodingItemAggregate type={props.type} />
        <EncodingItemValue type={props.type} />
      </Columns>
    </Columns>
  )
}

function EncodingItemType(props: { type: string }) {
  const descriptor = useStore((state) => state.descriptor)
  const updateState = useStore((state) => state.updateState)
  return (
    <SelectField
      label="Channel"
      value={props.type || ''}
      options={['x', 'y', 'xOffset', 'color']}
      onChange={(value) => {
        if (!value) return
        descriptor.encoding![value] = descriptor.encoding![props.type]
        delete descriptor.encoding![props.type]
        updateState({ descriptor })
      }}
    />
  )
}

function EncodingItemField(props: { type: string }) {
  const field = useStore((state) => state.descriptor.encoding![props.type].field)
  const descriptor = useStore((state) => state.descriptor)
  const updateState = useStore((state) => state.updateState)
  const fieldNames = useStore(selectors.fieldNames)
  return (
    <SelectField
      label="Field"
      value={field || ''}
      options={fieldNames}
      onChange={(value) => {
        descriptor.encoding![props.type].field = value
        updateState({ descriptor })
      }}
    />
  )
}

function EncodingItemAggregate(props: { type: string }) {
  const aggregate = useStore((state) => state.descriptor.encoding![props.type].aggregate)
  const descriptor = useStore((state) => state.descriptor)
  const updateState = useStore((state) => state.updateState)
  return (
    <SelectField
      label="Calc"
      value={aggregate || ''}
      options={['count', 'sum']}
      onChange={(value) => {
        descriptor.encoding![props.type].aggregate = value
        updateState({ descriptor })
      }}
    />
  )
}

function EncodingItemValue(props: { type: string }) {
  const value = useStore((state) => state.descriptor.encoding![props.type].value)
  const descriptor = useStore((state) => state.descriptor)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputField
      label="Value"
      value={value || ''}
      onChange={(value) => {
        descriptor.encoding![props.type].value = value
        updateState({ descriptor })
      }}
    />
  )
}
