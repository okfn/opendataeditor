import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Views/Library/Columns'
import DefaultButton from '../../Views/Library/Buttons/DefaultButton'
import MoveButton from '../../Views/Library/Buttons/MoveButton'
import EditorDropDownButton from '../../Views/Library/Groups/EditorDropDownButton'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Actions() {
  const theme = useTheme()
  const height = `calc(${theme.spacing(8)} - 1px)`
  return (
    <Box sx={{ lineHeight: height, borderTop: 1, borderColor: 'divider', paddingX: 2 }}>
      <Columns spacing={3}>
        <New />
        <Move />
        <Delete />
      </Columns>
    </Box>
  )
}

function New() {
  const createFile = useStore((state) => state.createFile)
  const createPackage = useStore((state) => state.createPackage)
  const editorOptions = ['+ New', 'Folder', 'Upload', 'Data Package']
  const path = useStore((state) => state.path)
  const handleCreateFile = (file: File) => {
    let newPath = file.name
    if (path) newPath = `${path}/${newPath}`

    const myNewFile = new File([file], newPath, { type: file.type })
    createFile(myNewFile)
  }
  return (
    <EditorDropDownButton
      path={path}
      options={editorOptions}
      onFileUpload={(file) => handleCreateFile(file)}
      onCreateDataPackage={createPackage}
    />
  )
}

function Move() {
  const moveFile = useStore((state) => state.moveFile)
  const createDirectory = useStore((state) => state.createDirectory)
  const path = useStore((state) => state.path)
  const listFolders = useStore((state) => state.listFolders)
  return (
    <MoveButton
      disabled={!path}
      label="Move"
      moveFile={(destination) => moveFile(destination)}
      createDirectory={(directoryname) => createDirectory(directoryname)}
      listFolders={listFolders}
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
