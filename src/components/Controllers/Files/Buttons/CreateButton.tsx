import * as React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/AddBox'
import FolderIcon from '@mui/icons-material/Folder'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DropdownButton from '../../../Parts/Buttons/DropdownButton'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import * as settings from '../../../../settings'
import { useStore, selectors } from '../store'

export default function CreateButton() {
  return (
    <DropdownButton
      label="Create"
      variant="text"
      icon={<AddIcon fontSize="small" sx={{ mr: 1 }} />}
    >
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
      <Button variant="text" color="info" component="label">
        <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
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
    <DefaultButton
      variant="text"
      color="info"
      label="Create Folder"
      icon={<CreateNewFolderIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => setDialog('name/createFolder')}
    />
  )
}

function PackageButton() {
  const filePaths = useStore(selectors.filePaths)
  const createPackage = useStore((state) => state.createPackage)
  return (
    <DefaultButton
      disabled={filePaths.includes(settings.PACKAGE_PATH)}
      variant="text"
      color="info"
      label="Create Package"
      icon={<FolderIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={createPackage}
    />
  )
}
