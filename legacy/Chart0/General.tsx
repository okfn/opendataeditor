import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../Parts/Fields/InputField'

export default function General() {
  return (
    <Box>
      <InputField label="Select table/view: show schema/data preview" value="" />
    </Box>
  )
}
