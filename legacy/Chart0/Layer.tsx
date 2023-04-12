import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../Parts/Fields/InputField'

interface LayerProps {
  number: number
}

export default function Layer(_props: LayerProps) {
  return (
    <Box>
      <InputField label="Axis (X)" value="" />
      <InputField label="Axis (Y)" value="" />
    </Box>
  )
}
