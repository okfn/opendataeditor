import * as React from 'react'
import Box from '@mui/material/Box'
import YesNoField from '../../../Parts/Fields/YesNo'
import { useStore, selectors, select } from '../store'
import * as settings from '../settings'
import InputField from '../../../Parts/Fields/Input'
import Columns from '../../../Parts/Columns'

export default function Bin() {
  return (
    <React.Fragment>
      <Columns spacing={3}>
        <Box>
          <IsBin />
        </Box>
        <Box>
          <Step />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function IsBin() {
  const bin = useStore(selectors.channelBin)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const isBin = typeof bin === 'boolean' ? bin : settings.DEFAULT_BIN
  return (
    <YesNoField
      label="Bin"
      value={isBin}
      onFocus={() => updateHelp('channels/bin')}
      onChange={(value) => {
        updateChannel({ bin: value })
      }}
    />
  )
}

function Step() {
  const bin = useStore(select(selectors.channel, (channel) => channel.bin))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateChannel = useStore((state) => state.updateChannel)
  const step = typeof bin === 'object' ? bin.step : ''
  return (
    <InputField
      label="Step"
      value={step}
      onFocus={() => updateHelp('transforms/binStep')}
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
