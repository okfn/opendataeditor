import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../Library/Columns'
import { useStore } from './store'

export default function Actions() {
  const uploadFile = useStore((state) => state.uploadFile)
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
        <Button fullWidth variant="outlined" color="info" component="label">
          Upload
          <input
            hidden
            type="file"
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              ev.target.files ? uploadFile(ev.target.files[0]) : null
            }
          />
        </Button>
        <Button fullWidth disabled variant="outlined" color="info">
          Delete
        </Button>
        <Button fullWidth disabled variant="outlined" color="info">
          Move
        </Button>
      </Columns>
    </Box>
  )
}
