import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import Schema from './Sections/Schema'
import Field from './Sections/Field'
import ForeignKey from './Sections/ForeignKey'
import Help from './Help'

export default function Layout() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs labels={['Schema', 'Fields', 'Foreign Keys']}>
          <Schema />
          <Field />
          <ForeignKey />
        </VerticalTabs>
        <Help />
      </Columns>
    </Box>
  )
}
