import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

export default function Actions() {
  const theme = useTheme()
  const height = `calc(${theme.spacing(8)} - 1px)`
  return (
    <Box sx={{ lineHeight: height, borderTop: 1, borderColor: 'divider', paddingX: 2 }}>
      Actions
    </Box>
  )
}
