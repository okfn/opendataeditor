import * as React from 'react'
import Box from '@mui/material/Box'
// import InputField from '../../../Parts/Fields/InputField'
import SelectField from '../../../Parts/Fields/SelectField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import { useStore, selectors } from '../store'
import * as settings from '../settings'

export default function Chart() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Chart" onHeadingClick={() => updateHelp('chart')}>
      <Columns spacing={3}>
        <Box>
          <Table />
          <Preset />
        </Box>
        <Box></Box>
      </Columns>
    </EditorSection>
  )
}

function Table() {
  const table = useStore((state) => state.table)
  const tables = useStore(selectors.tables)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <SelectField
      label="Table"
      value={table || ''}
      options={Object.keys(tables)}
      onFocus={() => updateHelp('chart/table')}
      onChange={(value) => updateState({ table: value || undefined })}
    />
  )
}

function Preset() {
  const preset = useStore((state) => state.preset)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <SelectField
      label="Preset"
      value={preset || ''}
      options={settings.PRESETS.map((item) => item.title)}
      onFocus={() => updateHelp('chart/preset')}
      onChange={(value) => updateState({ preset: value || undefined })}
    />
  )
}
