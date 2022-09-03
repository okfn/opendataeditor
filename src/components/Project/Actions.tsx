import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../Library/Columns'
import { useStore } from './store'

export default function Actions() {
  const path = useStore((state) => state.path)
  const createFile = useStore((state) => state.createFile)
  const deleteFile = useStore((state) => state.deleteFile)
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
              ev.target.files ? createFile(ev.target.files[0]) : null
            }
          />
        </Button>
        <Button fullWidth disabled={!path} variant="outlined" color="info">
          Move
        </Button>
        <Button
          fullWidth
          disabled={!path}
          variant="outlined"
          color="error"
          onClick={() => deleteFile()}
        >
          Delete
        </Button>
      </Columns>
    </Box>
  )
}
