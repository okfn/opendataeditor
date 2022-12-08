import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Views/Library/Columns'
import DefaultButton from '../../Views/Library/Buttons/DefaultButton'
import MoveButton from '../../Views/Library/Buttons/MoveButton'
import NewDropdown from '../../Views/Library/Groups/NewDropdown'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'
// import CopyButton from '../../Views/Library/Buttons/CopyButton'

export default function Actions() {
  const theme = useTheme()
  const height = `calc(${theme.spacing(8)} - 1px)`
  return (
    <Box sx={{ lineHeight: height, borderTop: 1, borderColor: 'divider', paddingX: 2 }}>
      <Columns spacing={2}>
        <New />
        <Move />
        {/* <Copy /> */}
        <Delete />
      </Columns>
    </Box>
  )
}

function New() {
  const createFile = useStore((state) => state.createFile)
  const createPackage = useStore((state) => state.createPackage)
  // const editorOptions = ['+ New', 'Folder', 'Upload', 'Data Package']
  const path = useStore((state) => state.path)
  const handleCreateFile = (file: File) => {
    let newPath = file.name
    if (path) newPath = `${path}/${newPath}`

    const myNewFile = new File([file], newPath, { type: file.type })
    createFile(myNewFile)
  }
  return (
    <NewDropdown
      path={path}
      // options={editorOptions}
      onFileUpload={(file) => handleCreateFile(file)}
      onCreateDataPackage={createPackage}
    />
  )
}

// function Copy() {
//   const copyFile = useStore((state) => state.copyFile)
//   const path = useStore((state) => state.path)
//   return (
//     <CopyButton
//       disabled={!path}
//       variant="text"
//       label="Copy"
//       color="info"
//       copyFile={() => copyFile()}
//     />
//   )
// }

function Move() {
  const moveFile = useStore((state) => state.moveFile)
  const copyFile = useStore((state) => state.copyFile)
  const path = useStore((state) => state.path)
  const listFolders = useStore((state) => state.listFolders)
  return (
    <MoveButton
      disabled={!path}
      variant="text"
      label="Move/Copy"
      color="info"
      moveFile={(destination) => moveFile(destination)}
      copyFile={(destination) => copyFile(destination)}
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
