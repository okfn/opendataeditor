import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import Query from './Query'
import Fields from './Fields'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const setEditor = useStore((state) => state.setEditor)

  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={2}>
        <Query setEditor={setEditor} />
        <Fields />
      </Columns>
    </Box>
  )
}
