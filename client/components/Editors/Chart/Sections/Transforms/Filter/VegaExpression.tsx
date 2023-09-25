import Box from '@mui/material/Box'
import Columns from '../../../../../Parts/Grids/Columns'
import InputField from '../../../../../Parts/Fields/Input'
import { useStore, selectors } from '../../../store'
import * as types from '../../../../../../types'

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
  const transform = useStore(selectors.transform!) as types.IExpression
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
