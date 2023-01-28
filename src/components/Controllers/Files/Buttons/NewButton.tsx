import * as React from 'react'
import Button from '@mui/material/Button'
import FolderIcon from '@mui/icons-material/Folder'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AddIcon from '@mui/icons-material/Add'
import DropdownButton from '../../../Parts/Buttons/DropdownButton'
import * as settings from '../../../../settings'
import { hasResource } from '../../../../helpers'
import { useStore } from '../store'

export default function NewButton() {
  return (
    <DropdownButton label="New" icon={<AddIcon />}>
      <UploadButton />
      <FolderButton />
      <PackageButton />
    </DropdownButton>
  )
}

function UploadButton() {
  const createFile = useStore((state) => state.createFile)
  return (
    <React.Fragment>
      <Button variant={settings.DEFUALT_BUTTON_VARIANT} color="info" component="label">
        <CloudUploadIcon sx={{ mr: 1 }} fontSize="small" />
        Upload File
        <input
          hidden
          type="file"
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
            ev.target.files ? createFile(ev.target.files[0]) : null
          }
        />
      </Button>
    </React.Fragment>
  )
}

function FolderButton() {
  const setDialog = useStore((state) => state.setDialog)
  return (
    <Button
      sx={{ mr: 1 }}
      fullWidth
      variant="text"
      component="label"
      color="info"
      onClick={() => setDialog('folder')}
    >
      <CreateNewFolderIcon sx={{ mr: 1 }} />
      Create Folder
    </Button>
  )
}

function PackageButton() {
  const paths = useStore((state) => state.paths)
  const createPackage = useStore((state) => state.createPackage)
  return (
    <Button
      sx={{ mr: 1 }}
      fullWidth
      disabled={!hasResource(paths)}
      component="label"
      variant="text"
      color="info"
      onClick={createPackage}
    >
      <FolderIcon sx={{ mr: 1 }} fontSize="small" />
      Create Package
    </Button>
  )
}
