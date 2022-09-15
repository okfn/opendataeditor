import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../Views/Library/Columns'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Actions() {
  const theme = useTheme()
  const height = `calc(${theme.spacing(8)} - 1px)`
  return (
    <Box sx={{ lineHeight: height, borderTop: 1, borderColor: 'divider', paddingX: 2 }}>
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
    <Button fullWidth variant="text" color="info" component="label">
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
    <Button fullWidth disabled={!path} variant="text" color="info">
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
      variant="text"
      color="warning"
      onClick={() => deleteFile()}
    >
      Delete
    </Button>
  )
}
