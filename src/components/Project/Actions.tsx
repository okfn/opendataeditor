import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../Library/Columns'
import { useStore } from './store'

export default function Actions() {
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
        <Upload />
        <Move />
        <Delete />
      </Columns>
    </Box>
  )
}

function Upload() {
  const createFile = useStore((state) => state.createFile)
  return (
    <Button fullWidth variant="contained" color="info" component="label">
      Upload
      <input
        hidden
        type="file"
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
          ev.target.files ? createFile(ev.target.files[0]) : null
        }
      />
    </Button>
  )
}

function Move() {
  const path = useStore((state) => state.path)
  return (
    <Button fullWidth disabled={!path} variant="contained" color="info">
      Move
    </Button>
  )
}

function Delete() {
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  return (
    <Button
      fullWidth
      disabled={!path}
      variant="contained"
      color="error"
      onClick={() => deleteFile()}
    >
      Delete
    </Button>
  )
}
