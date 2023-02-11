import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import ConfigPanel from './Panels/Config'
import Actions from './Actions'
import Content from './Content'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const panelHeight = 48
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 6 + panelHeight)})`
  return (
    <React.Fragment>
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: contentHeight }}>
          <Content />
        </Box>
        <Box
          sx={{
            overflowY: 'auto',
            height: theme.spacing(48),
            borderTop: 1,
            borderColor: 'divider',
            paddingX: 2,
          }}
        >
          <ConfigPanel />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </React.Fragment>
  )
}
