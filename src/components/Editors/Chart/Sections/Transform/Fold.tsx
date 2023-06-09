import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../../store'
import Columns from '../../../../Parts/Columns'
import InputField from '../../../../Parts/Fields/Input'
import * as types from '../../../../../types'

export default function Fold() {
  return (
    <React.Fragment>
      <Columns spacing={3}>
        <Box>
          <FoldField />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function FoldField() {
  const transform = useStore(selectors.transform!) as types.IFold
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="As"
      value={transform?.fold || [].join(',')}
      onFocus={() => updateHelp('transforms/fold')}
      onChange={(value) => {
        updateTransform({ ...transform, fold: value.split(',') })
      }}
    />
  )
}
