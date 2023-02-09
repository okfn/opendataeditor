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
  const initialUpload = useStore((state) => state.initialUpload ?? false)
  const initialDataPackage = useStore((state) => state.initialDataPackage ?? false)
  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  return (
    <DropdownButton
      label="Create"
      variant="text"
      open={initialDataPackage || initialUpload}
      icon={<AddIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <UploadButton />
      {isWebkitDirectorySupported && <UploadFolderButton />}
      <FolderButton />
      <PackageButton />
    </DropdownButton>
  )
}

function UploadButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  const initialUpload = useStore((state) => state.initialUpload)
  const setInitialUpload = useStore((state) => state.setInitialUpload)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  // Hooks
  React.useEffect(() => {
    if (initialUpload && inputFileRef.current) {
      inputFileRef.current.click()
    }
  }, [])
  return (
    <React.Fragment>
      <Button variant="text" color="info" component="label">
        <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
        Upload File
        <input
          type="file"
          hidden
          multiple
          ref={inputFileRef}
          onClick={(ev) => {
            document.body.onfocus = () => setInitialUpload(false)
            ev.stopPropagation()
          }}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
            ev.target.files ? uploadFiles(ev.target.files) : null
          }
        />
      </Button>
    </React.Fragment>
  )
}

function UploadFolderButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  return (
    <React.Fragment>
      <Button variant="text" color="info" component="label">
        <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
        Upload Folder
        <input
          type="file"
          hidden
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) {
              const files = [...ev.target.files].reduce(
                (files: any, file: File, _index: number) => {
                  files.push(
                    new File([file], file.webkitRelativePath, {
                      type: file.type,
                    })
                  )
                  return files
                },
                []
              )
              uploadFiles(files)
            }
          }}
          // @ts-expect-error
          webkitdirectory=""
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
      onClick={() => setDialog('name/create')}
    />
  )
}

function PackageButton() {
  const filePaths = useStore(selectors.filePaths)
  const createPackage = useStore((state) => state.createPackage)
  const initialDataPackage = useStore((state) => state.initialDataPackage)
  const setInitialDataPackage = useStore((state) => state.setInitialDataPackage)
  // Hooks
  React.useEffect(() => {
    if (initialDataPackage) {
      createPackage()
      setInitialDataPackage(false)
    }
  }, [])
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
