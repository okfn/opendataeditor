import * as React from 'react'
import Box from '@mui/material/Box'

export default function Content(props: { height: string }) {
  return (
    <Box sx={{ height: props.height }}>
      <Box sx={{ padding: 2 }}>No data view available</Box>
    </Box>
  )
}
