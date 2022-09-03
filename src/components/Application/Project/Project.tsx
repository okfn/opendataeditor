import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Tabs from './Tabs'
import * as React from 'react'
import { useStore } from '../store'

export default function Project() {
  const theme = useTheme()
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const footerHeight = isMetadataOpen ? theme.spacing(56 + 2) : theme.spacing(0)
  const contentHeight = `calc(100vh - ${theme.spacing(16)} - ${footerHeight} - 1px)`
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
