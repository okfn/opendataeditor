import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import EditorSection from '../../../Base/Section'
import { useStore } from '../../store'

export default function General() {
  const format = useStore((state) => state.format)
  return (
    <EditorSection name={format ? capitalize(format) : 'Unknown'}>
      <Columns spacing={3}>
        <Box>No options available for this format</Box>
      </Columns>
    </EditorSection>
  )
}
