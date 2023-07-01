import * as React from 'react'
import Box from '@mui/material/Box'
import YesNoField from '../../../../Parts/Fields/YesNo'
import { useStore, selectors } from '../../store'
import * as settings from '../../settings'
import InputField from '../../../../Parts/Fields/Input'
import Columns from '../../../../Parts/Grids/Columns'

export default function Bin() {
  return (
    <Columns spacing={3}>
      <Box>
        <IsBin />
      </Box>
      <Box>
        <Step />
      </Box>
    </Columns>
  )
}

function IsBin() {
  const bin = useStore(selectors.channelActiveInputValue('bin'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  const isBin = typeof bin === 'object' ? bin.binned : bin ?? settings.DEFAULT_BINNED
  return (
    <YesNoField
      label="Bin"
      value={isBin}
      onFocus={() => {
        updateHelp('channel/bin')
        updateChannelState({ activeInput: 'bin' })
      }}
      onChange={(value) => {
        updateChannel({ bin: value })
      }}
    />
  )
}

function Step() {
  const bin = useStore(selectors.channelActiveInputValue('bin'))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const updateChannelState = useStore((state) => state.updateChannelState)
  const step = typeof bin === 'object' ? bin.step : ''
  return (
    <InputField
      label="Step"
      value={step}
      onFocus={() => {
        updateHelp('channel/binStep')
        updateChannelState({ activeInput: 'bin' })
      }}
      onChange={(value) => {
        let bin
        if (parseInt(value) >= 0) {
          bin = { binned: true, step: parseInt(value) }
        }
        updateChannel({ bin })
      }}
    />
  )
}
