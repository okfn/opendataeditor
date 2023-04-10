import * as React from 'react'
// import InputField from '../../../Parts/Fields/InputField'
import SelectField from '../../../Parts/Fields/SelectField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import { Registry } from '../../../../libraries/vega-presets/registry'
import { useStore, selectors } from '../store'

export default function Chart() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Chart" onHeadingClick={() => updateHelp('chart')}>
      <Table />
      <Preset />
      <Options />
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
      options={Object.values(tables)}
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
      options={Registry.listPresets().map((Preset) => Preset.type)}
      onFocus={() => updateHelp('chart/preset')}
      onChange={(value) => updateState({ preset: value || undefined })}
    />
  )
}

function Options() {
  // @ts-ignore
  const Preset = useStore((state) => Registry.getPreset(state.preset))
  const options = useStore((state) => state.options)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const stringFields = useStore(selectors.stringFields)
  const numberFields = useStore(selectors.numberFields)
  if (!Preset) return null
  return (
    <React.Fragment>
      {Preset.target.options.map((option: any) => (
        <SelectField
          label={option.label}
          key={option.name}
          value={options[option.name] || ''}
          options={option.type === 'string' ? stringFields : numberFields}
          onFocus={() => updateHelp('chart/options')}
          onChange={(value) =>
            updateState({ options: { ...options, [option.name]: value } })
          }
        />
      ))}
    </React.Fragment>
  )
}
