import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../../store'
import Columns from '../../../../Parts/Columns'
import YesNoField from '../../../../Parts/Fields/YesNo'
import InputField from '../../../../Parts/Fields/Input'
import SelectField from '../../../../Parts/Fields/Select'

export default function Bin() {
  return (
    <React.Fragment>
      <Columns spacing={3}>
        <Box>
          <IsBin />
          <As />
        </Box>
        <Box>
          <Field />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function IsBin() {
  const transform = useStore(selectors.transform!)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <YesNoField
      label="Bin"
      value={transform?.bin?.bin ?? ''}
      onFocus={() => updateHelp('transforms/binBin')}
      onChange={(value) => {
        updateTransform({ bin: { ...transform.bin, bin: value } })
      }}
    />
  )
}

function Field() {
  const transform = useStore(selectors.transform!)
  const fieldNames = useStore(selectors.fieldNames)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <SelectField
      focused
      label="Field"
      value={transform?.bin?.field ?? ''}
      options={fieldNames}
      onFocus={() => updateHelp('transforms/binField')}
      onChange={(value) => {
        updateTransform({ bin: { ...transform.bin, field: value } })
      }}
    />
  )
}

function As() {
  const transform = useStore(selectors.transform!)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="As"
      value={transform?.bin?.as ?? ''}
      onFocus={() => updateHelp('transforms/binAs')}
      onChange={(value) => {
        updateTransform({ bin: { ...transform.bin, as: value } })
      }}
    />
  )
}
