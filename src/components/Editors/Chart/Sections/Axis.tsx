import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore, selectors, select } from '../store'
import InputField from '../../../Parts/Fields/Input'
import Columns from '../../../Parts/Columns'

export default function Axis() {
  return (
    <Columns spacing={3}>
      <Box>
        <Title />
        <LabelAngle />
      </Box>
      <Box>
        <LabelAlign />
        <LabelExpr />
      </Box>
    </Columns>
  )
}
function Title() {
  const axis = useStore(select(selectors.channel, (channel) => channel.axis))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <InputField
      label="Axis Title"
      value={axis?.title ?? ''}
      onFocus={() => updateHelp('transforms/axisTitle')}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, title: value } })
      }}
    />
  )
}

function LabelAngle() {
  const axis = useStore(select(selectors.channel, (channel) => channel.axis))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <InputField
      label="Label Angle"
      value={axis?.labelAngle ?? ''}
      onFocus={() => updateHelp('transforms/axisLabelAngle')}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, labelAngle: value } })
      }}
    />
  )
}

function LabelAlign() {
  const axis = useStore(select(selectors.channel, (channel) => channel.axis))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <InputField
      label="Label Align"
      value={axis?.labelAlign ?? ''}
      onFocus={() => updateHelp('transforms/axisLabelAlign')}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, labelAlign: value } })
      }}
    />
  )
}

function LabelExpr() {
  const axis = useStore(select(selectors.channel, (channel) => channel.axis))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  return (
    <InputField
      label="Label Expression"
      value={axis?.labelExpr ?? ''}
      onFocus={() => updateHelp('transforms/axisLabelExpression')}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, labelExpr: value } })
      }}
    />
  )
}
