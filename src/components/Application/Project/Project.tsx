import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Tabs from './Tabs'
import * as React from 'react'

export default function Project() {
  const theme = useTheme()
  const footerHeight = theme.spacing(8)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight})`
  return (
    <React.Fragment>
      <Box sx={{ borderRight: 'solid 1px #ddd' }}>
        <Box sx={{ height: contentHeight }}>
          <Tabs />
        </Box>
        <Box sx={{ height: footerHeight }}>
          <Actions />
        </Box>
      </Box>
    </React.Fragment>
  )
}
