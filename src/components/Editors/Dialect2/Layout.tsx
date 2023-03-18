import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import Dialect from './Sections/Dialect'
import Csv from './Sections/Csv'
import Help from './Help'
import { useStore } from './store'

// TODO: support Excel/Json formats
const LABELS = ['Dialect', 'Csv']

export default function Layout() {
  const theme = useTheme()
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs
          labels={LABELS}
          onChange={(index) => updateHelp(`dialect/${camelCase(LABELS[index])}`)}
        >
          <Dialect />
          <Csv />
        </VerticalTabs>
        <Help />
      </Columns>
    </Box>
  )
}
