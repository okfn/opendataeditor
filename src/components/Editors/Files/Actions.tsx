import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Views/Library/Columns'
import DefaultButton from '../../Views/Library/Buttons/DefaultButton'
import UploadButton from '../../Views/Library/Buttons/UploadButton'
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
    <UploadButton variant="text" label="Upload" onUpload={(file) => createFile(file)} />
  )
}

function Move() {
  const path = useStore((state) => state.path)
  return (
    <DefaultButton
      disabled={!path}
      variant="text"
      label="Move"
      onClick={() => console.log('move')}
    />
  )
}

function Delete() {
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  return (
    <DefaultButton
      disabled={!path}
      variant="text"
      label="Delete"
      color="warning"
      onClick={() => deleteFile()}
    />
  )
}
