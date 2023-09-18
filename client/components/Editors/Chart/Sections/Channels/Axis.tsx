import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../../store'
import InputField from '../../../../Parts/Fields/Input'
import Columns from '../../../../Parts/Grids/Columns'

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
  const axis = useStore(selectors.channelActiveInputValue('axis'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Axis Title"
      value={axis?.title ?? ''}
      onFocus={() => {
        updateHelp('channels/axisTitle')
        updateChannelState({ activeInput: 'axis' })
      }}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, title: value } })
      }}
    />
  )
}

function LabelAngle() {
  const axis = useStore(selectors.channelActiveInputValue('axis'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Label Angle"
      value={axis?.labelAngle ?? ''}
      onFocus={() => {
        updateHelp('channels/axisLabelAngle')
        updateChannelState({ activeInput: 'axis' })
      }}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, labelAngle: value } })
      }}
    />
  )
}

function LabelAlign() {
  const axis = useStore(selectors.channelActiveInputValue('axis'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Label Align"
      value={axis?.labelAlign ?? ''}
      onFocus={() => {
        updateHelp('channels/axisLabelAlign')
        updateChannelState({ activeInput: 'axis' })
      }}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, labelAlign: value } })
      }}
    />
  )
}

function LabelExpr() {
  const axis = useStore(selectors.channelActiveInputValue('axis'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  return (
    <InputField
      label="Label Expression"
      value={axis?.labelExpr ?? ''}
      onFocus={() => {
        updateHelp('channels/axisLabelExpression')
        updateChannelState({ activeInput: 'axis' })
      }}
      onChange={(value) => {
        updateChannel({ axis: { ...axis, labelExpr: value } })
      }}
    />
  )
}
