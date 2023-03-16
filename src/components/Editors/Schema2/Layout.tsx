import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import Schema from './Groups/Schema'
import Fields from './Groups/Fields'
import ForeignKeys from './Groups/ForeignKeys'
import Help from './Help'

export default function Layout() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs labels={['Schema', 'Fields', 'Foreign Keys']}>
          <Schema />
          <Fields />
          <ForeignKeys />
        </VerticalTabs>
        <Help />
      </Columns>
    </Box>
  )
}
