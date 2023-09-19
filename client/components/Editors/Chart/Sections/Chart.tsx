import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import SelectField from '../../../Parts/Fields/Select'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore, selectors } from '../store'
import * as settings from '../settings'
import YesNoField from '../../../Parts/Fields/YesNo'

export default function Chart() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Chart" onHeadingClick={() => updateHelp('chart')}>
      <Columns spacing={3}>
        <Box>
          <Table />
          <Title />
          <Mark />
        </Box>
        <Box>
          <Width />
          <Height />
          <Tooltip />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Table() {
  const descriptor = useStore((state) => state.descriptor)
  const url = useStore((state) => state.descriptor.data?.url)
  const values = useStore((state) => state.descriptor.data?.values)
  const tablePaths = useStore(selectors.tablePaths)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <SelectField
      label="Table"
      value={values ? '(inline)' : url || ''}
      options={tablePaths}
      onFocus={() => updateHelp('chart/table')}
      onChange={(value) => {
        if (!value) return
        if (value === '(inline)') return
        descriptor.data = descriptor.data || {}
        descriptor.data.url = value
        updateState({ descriptor })
      }}
    />
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('chart/title')}
      onChange={(value) => updateDescriptor({ title: value })}
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
      onChange={(value) => updateDescriptor({ width: parseInt(value) || undefined })}
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
      onChange={(value) => updateDescriptor({ height: parseInt(value) || undefined })}
    />
  )
}

function Mark() {
  const descriptor = useStore((state) => state.descriptor)
  const mark = useStore((state) => state.descriptor.mark)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const type = typeof mark === 'object' ? mark.type : mark
  return (
    <SelectField
      label="Mark"
      value={type || ''}
      options={settings.MARKS}
      onFocus={() => updateHelp('chart/mark')}
      onChange={(value) => {
        if (!value) return
        descriptor.mark = value
        updateState({ descriptor })
      }}
    />
  )
}

function Tooltip() {
  const descriptor = useStore((state) => state.descriptor)
  const mark = useStore((state) => state.descriptor.mark)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const tooltip = typeof mark === 'object' ? mark.tooltip : settings.DEFAULT_TOOLTIP
  return (
    <YesNoField
      label="Tooltip"
      value={tooltip}
      onFocus={() => updateHelp('chart/tooltip')}
      onChange={(value) => {
        const type = typeof mark === 'string' ? mark : mark?.type
        if (value) {
          descriptor.mark = { type: type ?? '', tooltip: value }
        } else {
          if (type) {
            descriptor.mark = type
          } else {
            delete descriptor.mark
          }
        }
        updateState({ descriptor })
      }}
    />
  )
}
