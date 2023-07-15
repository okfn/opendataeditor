import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import EditorSection from '../../../Base/Section'
import { useStore } from '../../store'

export default function General() {
  const type = useStore((state) => state.type)
  return (
    <EditorSection name={type ? capitalize(type) : 'Unknown'}>
      <Columns spacing={3}>
        <Box>No options available for this type</Box>
      </Columns>
    </EditorSection>
  )
}
