import * as React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/AddBox'
import FolderIcon from '@mui/icons-material/Folder'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import ViewIcon from '@mui/icons-material/Storage'
import ChartIcon from '@mui/icons-material/Leaderboard'
import DropdownButton from '../../../Parts/Buttons/DropdownButton'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import * as settings from '../../../../settings'
import { useStore, selectors } from '../store'
import { AddLink } from '@mui/icons-material'
import { DriveFolderUploadRounded, UploadFileRounded } from '@mui/icons-material'

export default function CreateButton() {
  const initialAction = useStore((state) => state.initialAction)
  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  const open = initialAction !== undefined
  return (
    <DropdownButton
      label="Create"
      variant="text"
      open={open}
      icon={<AddIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <UploadButton />
      <UploadLink />
      {isWebkitDirectorySupported && <UploadFolderButton />}
      <FolderButton />
      <PackageButton />
      <ViewButton />
      <ChartButton />
    </DropdownButton>
  )
}

function UploadButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  const initialAction = useStore((state) => state.initialAction)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const isUpload = initialAction === 'upload/file'
  React.useEffect(() => {
    if (isUpload && inputFileRef.current) {
      inputFileRef.current.click()
    }
  }, [])
  return (
    <React.Fragment>
      <Button fullWidth variant="text" color="info" component="label">
        <UploadFileRounded fontSize="small" sx={{ mr: 1 }} />
        Upload File
        <input
          type="file"
          hidden
          multiple
          ref={inputFileRef}
          onClick={
            isUpload
              ? (ev) => {
                  document.body.onfocus = () => setInitialAction(undefined)
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
  const initialAction = useStore((state) => state.initialAction)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const isUpload = initialAction === 'upload/link'
  React.useEffect(() => {
    if (isUpload) {
      setDialog('link/create')
      setInitialAction(undefined)
    }
  }, [])
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

function UploadFolderButton() {
  const uploadFolder = useStore((state) => state.uploadFolder)
  const initialAction = useStore((state) => state.initialAction)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const isUpload = initialAction === 'upload/folder'
  React.useEffect(() => {
    if (isUpload && inputFileRef.current) {
      inputFileRef.current.click()
    }
  }, [])
  return (
    <React.Fragment>
      <Button variant="text" color="info" component="label">
        <DriveFolderUploadRounded fontSize="small" sx={{ mr: 1 }} />
        Upload Folder
        <input
          type="file"
          ref={inputFileRef}
          hidden
          onClick={
            isUpload
              ? (ev) => {
                  document.body.onfocus = () => setInitialAction(undefined)
                  ev.stopPropagation()
                }
              : undefined
          }
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            if (ev.target.files) uploadFolder(ev.target.files)
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
  const initialAction = useStore((state) => state.initialAction)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const isCreate = initialAction === 'create/folder'
  React.useEffect(() => {
    if (isCreate) {
      setDialog('name/create')
      setInitialAction(undefined)
    }
  }, [])
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
  const initialAction = useStore((state) => state.initialAction)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const isCreate = initialAction === 'create/package'
  React.useEffect(() => {
    if (isCreate) {
      createPackage()
      setInitialAction(undefined)
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
  const initialAction = useStore((state) => state.initialAction)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const isCreate = initialAction === 'create/sql'
  React.useEffect(() => {
    if (isCreate) {
      createView()
      setInitialAction(undefined)
    }
  }, [])
  const createView = () => {
    const file = new File([], 'view.json')
    // TODO: fix
    // @ts-ignore
    uploadFiles([file])
  }
  return (
    <DefaultButton
      variant="text"
      color="info"
      label="Create SQL View"
      icon={<ViewIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => {
        createView()
      }}
    />
  )
}

function ChartButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  const initialAction = useStore((state) => state.initialAction)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const isCreate = initialAction === 'create/chart'
  React.useEffect(() => {
    if (isCreate) {
      createChart()
      setInitialAction(undefined)
    }
  }, [])
  const createChart = () => {
    const file = new File([], 'chart.json')
    // TODO: fix
    // @ts-ignore
    uploadFiles([file])
  }
  return (
    <DefaultButton
      variant="text"
      color="info"
      label="Create Chart"
      icon={<ChartIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => {
        createChart()
      }}
    />
  )
}
