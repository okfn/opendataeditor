import * as React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/AddBox'
import FolderIcon from '@mui/icons-material/Folder'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ViewIcon from '@mui/icons-material/Storage'
import ChartIcon from '@mui/icons-material/Leaderboard'
import DropdownButton from '../../../Parts/Buttons/DropdownButton'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import * as settings from '../../../../settings'
import { useStore, selectors } from '../store'
import { AddLink } from '@mui/icons-material'

export default function CreateButton() {
  const initialUpload = useStore((state) => state.initialUpload ?? false)
  const initialDataPackage = useStore((state) => state.initialDataPackage ?? false)
  return (
    <DropdownButton
      label="Create"
      variant="text"
      open={initialUpload || initialDataPackage}
      icon={<AddIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <UploadButton />
      <UploadLink />
      <FolderButton />
      <PackageButton />
      <ViewButton />
      <ChartButton />
    </DropdownButton>
  )
}

function UploadButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  const initialUpload = useStore((state) => state.initialUpload)
  const setInitialUpload = useStore((state) => state.setInitialUpload)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (initialUpload && inputFileRef.current) {
      inputFileRef.current.click()
    }
  }, [])
  return (
    <React.Fragment>
      <Button fullWidth variant="text" color="info" component="label">
        <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
        Upload File
        <input
          type="file"
          hidden
          multiple
          ref={inputFileRef}
          onClick={
            initialUpload
              ? (ev) => {
                  document.body.onfocus = () => setInitialUpload(false)
                  ev.stopPropagation()
                }
              : undefined
          }
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) uploadFiles(ev.target.files)
          }}
        />
      </Button>
    </React.Fragment>
  )
}

function UploadLink() {
  const setDialog = useStore((state) => state.setDialog)
  return (
    <DefaultButton
      variant="text"
      color="info"
      label="Upload Link"
      icon={<AddLink fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => setDialog('link/create')}
    />
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

function ViewButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  return (
    <DefaultButton
      variant="text"
      color="info"
      label="Create SQL View"
      icon={<ViewIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => {
        const file = new File([], 'view.sql')
        // TODO: fix
        // @ts-ignore
        uploadFiles([file])
      }}
    />
  )
}

function ChartButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  return (
    <DefaultButton
      variant="text"
      color="info"
      label="Create Chart"
      icon={<ChartIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => {
        const file = new File([], 'chart.vljson')
        // TODO: fix
        // @ts-ignore
        uploadFiles([file])
      }}
    />
  )
}
