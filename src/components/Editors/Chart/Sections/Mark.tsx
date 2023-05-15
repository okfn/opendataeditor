import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore } from '../store'
// import InputField from '../../../Parts/Fields/Input'
import Columns from '../../../Parts/Columns'
import YesNoField from '../../../Parts/Fields/YesNo'
import * as settings from '../settings'
import SelectField from '../../../Parts/Fields/Select'

export default function Mark() {
  return (
    <Columns spacing={3}>
      <Box>
        <Type />
      </Box>
      <Box>
        <Tooltip />
        {/* <Content /> */}
      </Box>
    </Columns>
  )
}

function Type() {
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
      onFocus={() => updateHelp('chart/markTooltip')}
      onChange={(value) => {
        if (!value) return
        descriptor.mark = { type: mark, tooltip: true }
        updateState({ descriptor })
      }}
    />
  )
}

// function Content() {
//   const bin = useStore(select(selectors.channel, (channel) => channel.bin))
//   const updateHelp = useStore((state) => state.updateHelp)
//   const updateChannel = useStore((state) => state.updateChannel)
//   const step = typeof bin === 'object' ? bin.step : ''
//   return (
//     <InputField
//       label="Content"
//       value={step}
//       onFocus={() => updateHelp('transforms/binStep')}
//       onChange={(value) => {
//         let bin
//         if (parseInt(value) >= 0) {
//           bin = { binned: true, step: parseInt(value) }
//         }
//         updateChannel({ bin })
//       }}
//     />
//   )
// }
