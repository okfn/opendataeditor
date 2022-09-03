import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tabs from './Tabs'
import * as React from 'react'

export default function Project() {
  const theme = useTheme()
  const footerHeight = theme.spacing(8)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight})`
  return (
    <React.Fragment>
      <Box sx={{ height: contentHeight }}>
        <Tabs />
      </Box>
      <Box sx={{ height: footerHeight }}>
        <Button fullWidth variant="outlined" title="Toogle source view" color="info">
          Show Metadata
        </Button>
      </Box>
    </React.Fragment>
  )
}
