import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Data from './Data'
import Metadata from './Metadata'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const metadataHeight = isMetadataOpen ? theme.spacing(56) : 0
  const contentHeight = `calc(100% - ${metadataHeight}px)`
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: contentHeight }}>
        <Data />
      </Box>
      {isMetadataOpen && (
        <Box sx={{ height: metadataHeight, marginTop: 'auto' }}>
          <Metadata />
        </Box>
      )}
    </Box>
  )
}
