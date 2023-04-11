import * as React from 'react'
import Box from '@mui/material/Box'
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
        <Box>
          <Table />
          <Mark />
        </Box>
        <Box>
          <Height />
          <Width />
        </Box>
      </Columns>
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

function Height() {
  const height = useStore((state) => state.descriptor.height)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Height"
      value={height || ''}
      onFocus={() => updateHelp('chart/height')}
      onChange={(value) => updateDescriptor({ height: value || undefined })}
    />
  )
}

function Width() {
  const width = useStore((state) => state.descriptor.width)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Width"
      value={width || ''}
      onFocus={() => updateHelp('chart/width')}
      onChange={(value) => updateDescriptor({ width: value || undefined })}
    />
  )
}
