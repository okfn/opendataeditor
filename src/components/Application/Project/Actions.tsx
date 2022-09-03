import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../Library/Columns'
// import { useStore } from './store'

export default function Actions() {
  // const isPreview = uore((state) => state.revert)
  return (
    <Box
      sx={{
        borderTop: 'solid 1px #ddd',
        lineHeight: '63px',
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <Columns spacing={3}>
        <Button fullWidth variant="outlined">
          Upload
        </Button>
        <Button fullWidth disabled variant="outlined">
          Delete
        </Button>
        <Button fullWidth disabled variant="outlined">
          Move
        </Button>
      </Columns>
    </Box>
  )
}
