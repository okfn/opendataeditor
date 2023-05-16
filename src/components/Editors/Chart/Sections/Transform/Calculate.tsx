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
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="Expression"
      value={transform?.calculate}
      onFocus={() => updateHelp('transforms/calculateExpression')}
      onChange={(value) => {
        updateTransform({ ...transform, calculate: value })
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
      value={transform?.as}
      onFocus={() => updateHelp('transforms/calculateAs')}
      onChange={(value) => {
        updateTransform({ ...transform, as: value })
      }}
    />
  )
}
