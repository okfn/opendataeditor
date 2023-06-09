import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../../Parts/Columns'
import InputField from '../../../../../Parts/Fields/Input'
import { useStore, selectors } from '../../../store'
import { IExpression } from '../../../../../../interfaces'

export default function VegaExpression() {
  return (
    <Columns spacing={3}>
      <Box>
        <Expression />
      </Box>
    </Columns>
  )
}

function Expression() {
  const transform = useStore(selectors.transform!) as IExpression
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="Expression"
      value={transform?.filter ?? ''}
      onFocus={() => updateHelp('transforms/filterExpressionValue')}
      onChange={(value) => {
        updateTransform({ filter: value })
      }}
    />
  )
}
