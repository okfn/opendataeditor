import * as React from 'react'
import Box from '@mui/material/Box'
import Data from './Data'
import Metadata from './Metadata'

export default function Layout() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Data />
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Metadata />
      </Box>
    </Box>
  )
}
