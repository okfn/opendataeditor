import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Metadata from './Metadata'
import { useStore } from '../store'

export default function Footer() {
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const contentType = useStore((state) => state.contentType)
  if (contentType !== 'data') return null
  return (
    <Box>
      <Box
        sx={{
          borderTop: 'solid 1px #ddd',
          lineHeight: '63px',
          pl: 2,
          pr: 2,
          // backgroundColor: 'grey.200',
          // borderColor: 'grey.400',
        }}
      >
        <Actions />
      </Box>
      {isMetadataOpen ? (
        <Box sx={{ padding: 2, paddingBottom: 0, borderTop: 'solid 1px #ddd' }}>
          <Metadata />
        </Box>
      ) : null}
    </Box>
  )
}
