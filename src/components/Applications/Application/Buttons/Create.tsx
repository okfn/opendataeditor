import * as React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/AddBox'
import SourceIcon from '@mui/icons-material/Source'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import DropdownButton from '../../../Parts/Buttons/Dropdown'
import IconButton from '../../../Parts/Buttons/Icon'
import AddLink from '@mui/icons-material/AddLink'
import DriveFolderUploadRounded from '@mui/icons-material/DriveFolderUploadRounded'
import UploadFileRounded from '@mui/icons-material/UploadFileRounded'
import { useStore } from '../store'

export default function CreateButton() {
  return (
    <DropdownButton
      label="Create"
      variant="text"
      icon={<AddIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <AddFile />
      <FetchFile />
      <AddFolder />
      <CreateFolder />
      <CreateDataset />
    </DropdownButton>
  )
}

function AddFile() {
  const createFiles = useStore((state) => state.createFiles)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  return (
    <React.Fragment>
      <Button
        fullWidth
        variant="text"
        component="label"
        startIcon={<UploadFileRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        Add File
        <input
          type="file"
          hidden
          multiple
          ref={inputFileRef}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) createFiles(ev.target.files)
          }}
        />
      </Button>
    </React.Fragment>
  )
}

function AddFolder() {
  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  if (!isWebkitDirectorySupported) return null
  const createFiles = useStore((state) => state.createFiles)
  return (
    <React.Fragment>
      <Button
        variant="text"
        component="label"
        startIcon={<DriveFolderUploadRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        Add Folder
        <input
          type="file"
          hidden
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) createFiles(ev.target.files)
          }}
          // @ts-expect-error
          webkitdirectory=""
        />
      </Button>
    </React.Fragment>
  )
}

function FetchFile() {
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      variant="text"
      label="Fetch File"
      Icon={AddLink}
      onClick={() => updateState({ dialog: 'fetchFile' })}
    />
  )
}

function CreateFolder() {
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      variant="text"
      label="Create Folder"
      Icon={CreateNewFolderIcon}
      onClick={() => updateState({ dialog: 'createFolder' })}
    />
  )
}

function CreateDataset() {
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      variant="text"
      label="Create Dataset"
      Icon={SourceIcon}
      onClick={() => updateState({ dialog: 'createDataset' })}
    />
  )
}
