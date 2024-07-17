import * as React from 'react'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'
import AddLinkIcon from '@mui/icons-material/AddLink'
import DropdownButton from '../../Parts/Buttons/Dropdown'
import IconButton from '../../Parts/Buttons/Icon'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import DriveFolderUploadRounded from '@mui/icons-material/DriveFolderUploadRounded'
import UploadFileRounded from '@mui/icons-material/UploadFileRounded'
import * as store from '@client/store'

export default function AddButton() {
  const event = store.useStore((state) => state.event)

  return (
    <DropdownButton
      label="Add"
      variant="text"
      icon={<AddBoxIcon fontSize="small" sx={{ mr: 1 }} />}
      complete={event ? false : true}
    >
      <AddLocalFileButton />
      <AddRemoteFileButton />
      <AddLocalFolderButton />
      <AddEmptyFolderButton />
    </DropdownButton>
  )
}

function AddLocalFileButton() {
  const inputFileRef = React.useRef<HTMLInputElement>(null)

  return (
    <React.Fragment>
      <Button
        fullWidth
        variant="text"
        component="label"
        startIcon={<UploadFileRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        File
        <input
          type="file"
          hidden
          multiple
          ref={inputFileRef}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) store.addFiles(ev.target.files)
          }}
        />
      </Button>
    </React.Fragment>
  )
}

function AddRemoteFileButton() {
  return (
    <IconButton
      variant="text"
      label="Remote File"
      Icon={AddLinkIcon}
      onClick={() => store.openDialog('addRemoteFile')}
    />
  )
}

function AddLocalFolderButton() {
  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  if (!isWebkitDirectorySupported) return null

  return (
    <React.Fragment>
      <Button
        variant="text"
        component="label"
        startIcon={<DriveFolderUploadRounded fontSize="small" sx={{ mr: 1 }} />}
      >
        Folder
        <input
          type="file"
          hidden
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) store.addFiles(ev.target.files)
          }}
          // @ts-expect-error
          webkitdirectory=""
        />
      </Button>
    </React.Fragment>
  )
}

function AddEmptyFolderButton() {
  return (
    <IconButton
      variant="text"
      label="Create Folder"
      Icon={CreateNewFolderIcon}
      onClick={() => store.openDialog('addEmptyFolder')}
    />
  )
}
