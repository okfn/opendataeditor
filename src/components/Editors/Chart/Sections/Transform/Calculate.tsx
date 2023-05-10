import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Columns'
import InputField from '../../../../Parts/Fields/Input'
import { useStore, selectors } from '../../store'

export default function Calculate() {
  return (
    <Columns spacing={3}>
      <Box>
        <Expression />
      </Box>
      <Box>
        <As />
      </Box>
    </Columns>
  )
}

function Expression() {
  const transform = useStore(selectors.transform!)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      label="Expression"
      value={transform?.aggregate?.value!}
      onFocus={() => updateHelp('transforms/calculateExpression')}
      // onChange={(value) => updateDescriptor({ width: parseInt(value) || undefined })}
    />
  )
}

function As() {
  const transform = useStore(selectors.transform!)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <InputField
      label="As"
      value={transform?.aggregate?.value!}
      onFocus={() => updateHelp('transforms/calculateAs')}
      // onChange={(value) => updateDescriptor({ width: parseInt(value) || undefined })}
    />
  )
}
