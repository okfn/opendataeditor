import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import General from './Groups/General'
import Fields from './Groups/Fields'
import ForeignKeys from './Groups/ForeignKeys'
import Help from './Help'

export default function Layout() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs labels={['General', 'Fields', 'Foreign Keys']}>
          <General />
          <Fields />
          <ForeignKeys />
        </VerticalTabs>
        <Help />
      </Columns>
    </Box>
  )
}
