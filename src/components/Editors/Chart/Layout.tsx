import * as React from 'react'
import Box from '@mui/material/Box'
import VerticalTabs from '../../Parts/VerticalTabs'
import General from './General'
import Layer from './Layer'
import { useTheme } from '@mui/material/styles'

export default function Layout() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <VerticalTabs labels={['General', 'Layer 1', 'Layer 2', 'Layer 3']}>
        <General />
        <Layer number={1} />
        <Layer number={2} />
        <Layer number={3} />
      </VerticalTabs>
    </Box>
  )
}
