import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import Query from './Query'
import Fields from './Fields'
import { useTheme } from '@mui/material/styles'

export default function Layout() {
  const theme = useTheme()

  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={2}>
        <Query />
        <Fields />
      </Columns>
    </Box>
  )
}
