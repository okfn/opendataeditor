import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Metadata from './Metadata'
import { useStore } from '../store'

export default function Footer() {
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  return (
    <Box>
      <Box
        sx={{
          height: '64px',
          lineHeight: '62px',
          paddingLeft: 2,
          paddingRight: 2,
          borderTop: 'solid 1px #ddd',
          borderBottom: 'solid 1px #ddd',
        }}
      >
        <Actions />
      </Box>
      {isMetadataOpen ? (
        <Box sx={{ padding: 2, paddingBottom: 0 }}>
          <Metadata />
        </Box>
      ) : null}
    </Box>
  )
}
