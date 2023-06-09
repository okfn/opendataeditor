import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../../Parts/Columns'
import InputField from '../../../../../Parts/Fields/Input'
import { useStore, selectors } from '../../../store'
import * as types from '../../../../../../types'

export default function ParamPredicate() {
  return (
    <Columns spacing={3}>
      <Box>
        <Param />
      </Box>
    </Columns>
  )
}

function Param() {
  const transform = useStore(selectors.transform!) as types.IParamPredicate
  const updateHelp = useStore((state) => state.updateHelp)
  const updateTransform = useStore((state) => state.updateTransform)
  return (
    <InputField
      label="Param"
      value={transform?.filter?.param ?? ''}
      onFocus={() => updateHelp('transforms/filterParamParam')}
      onChange={(value) => {
        updateTransform({ filter: { ...transform.filter, param: value } })
      }}
    />
  )
}
