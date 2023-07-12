import * as React from 'react'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked'
import AddLinkIcon from '@mui/icons-material/AddLink'
import DropdownButton from '../../Parts/Buttons/Dropdown'
import IconButton from '../../Parts/Buttons/Icon'
import DriveFolderUploadRounded from '@mui/icons-material/DriveFolderUploadRounded'
import UploadFileRounded from '@mui/icons-material/UploadFileRounded'
import { useStore } from '../store'

export default function CreateButton() {
  return (
    <DropdownButton
      label="Import"
      variant="text"
      icon={<AddBoxIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <AddFile />
      <AddFolder />
      <FetchFile />
      <FetchDataset />
    </DropdownButton>
  )
}

function AddFile() {
  const addFiles = useStore((state) => state.addFiles)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  return (
    <React.Fragment>
      <Button
        fullWidth
        variant="text"
        component="label"
        startIcon={<UploadFileRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        Local File
        <input
          type="file"
          hidden
          multiple
          ref={inputFileRef}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) addFiles(ev.target.files)
          }}
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
      label="Remote File"
      Icon={AddLinkIcon}
      onClick={() => updateState({ dialog: 'fetchFile' })}
    />
  )
}

function AddFolder() {
  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  if (!isWebkitDirectorySupported) return null
  const addFiles = useStore((state) => state.addFiles)
  return (
    <React.Fragment>
      <Button
        variant="text"
        component="label"
        startIcon={<DriveFolderUploadRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        Local Folder
        <input
          type="file"
          hidden
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) addFiles(ev.target.files)
          }}
          // @ts-expect-error
          webkitdirectory=""
        />
      </Button>
    </React.Fragment>
  )
}

function FetchDataset() {
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      disabled
      variant="text"
      label="Remote Dataset"
      Icon={DatasetLinkedIcon}
      onClick={() => updateState({ dialog: 'create' })}
    />
  )
}
