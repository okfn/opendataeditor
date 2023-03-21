import * as React from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/AddBox'
import { useStore } from '../store'

export default function CreateButton() {
  const setDialog = useStore((state) => state.setDialog)
  return (
    <React.Fragment>
      <UploadButton />
      <UploadFolderButton />
      <CreateChart />
      <CreateView />
      <CreatePackage />
      <Button
        onClick={() => {
          setDialog('create/dialog')
        }}
      >
        <AddIcon fontSize="small" sx={{ mr: 1 }} /> Create
      </Button>
    </React.Fragment>
  )
}

function UploadButton() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  const action = useStore((state) => state.action)
  const setAction = useStore((state) => state.setAction)
  const setDialog = useStore((state) => state.setDialog)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const isUpload = action === 'upload/file'
  React.useEffect(() => {
    if (isUpload && inputFileRef.current) {
      inputFileRef.current.click()
    }
  }, [action])
  const onBlur = () => {
    setAction(undefined)
    setDialog(undefined)
    if (inputFileRef.current) inputFileRef.current.value = ''
  }
  return (
    <input
      type="file"
      hidden
      multiple
      ref={inputFileRef}
      onClick={(ev) => {
        if (isUpload) {
          document.body.onfocus = onBlur
          ev.stopPropagation()
        }
      }}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files) uploadFiles(ev.target.files)
      }}
    />
  )
}

function UploadFolderButton() {
  const uploadFolder = useStore((state) => state.uploadFolder)
  const action = useStore((state) => state.action)
  const setAction = useStore((state) => state.setAction)
  const setDialog = useStore((state) => state.setDialog)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const isUpload = action === 'upload/folder'
  React.useEffect(() => {
    if (isUpload && inputFileRef.current) {
      inputFileRef.current.click()
    }
  }, [action])
  const onBlur = () => {
    setAction(undefined)
    setDialog(undefined)
    if (inputFileRef.current) inputFileRef.current.value = ''
  }
  return (
    <input
      type="file"
      ref={inputFileRef}
      hidden
      onClick={(ev) => {
        if (isUpload) {
          document.body.onfocus = onBlur
          ev.stopPropagation()
        }
      }}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files) {
          uploadFolder(ev.target.files)
        }
      }}
      // @ts-expect-error
      webkitdirectory=""
    />
  )
}

function CreateChart() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  const setAction = useStore((state) => state.setAction)
  const setDialog = useStore((state) => state.setDialog)
  const action = useStore((state) => state.action)
  const isCreate = action === 'create/chart'
  const resetAction = () => {
    setAction(undefined)
    setDialog(undefined)
  }
  React.useEffect(() => {
    if (isCreate) {
      const file = new File([], 'chart.json')
      // TODO: fix
      // @ts-ignore
      uploadFiles([file]).finally(resetAction)
    }
  }, [action])
  return null
}

function CreateView() {
  const uploadFiles = useStore((state) => state.uploadFiles)
  const setAction = useStore((state) => state.setAction)
  const setDialog = useStore((state) => state.setDialog)
  const action = useStore((state) => state.action)
  const isCreate = action === 'create/view'
  const resetAction = () => {
    setAction(undefined)
    setDialog(undefined)
  }
  React.useEffect(() => {
    if (isCreate) {
      const file = new File([], 'view.json')
      // TODO: fix
      // @ts-ignore
      uploadFiles([file]).finally(resetAction)
    }
  }, [action])
  return null
}

function CreatePackage() {
  const createPackage = useStore((state) => state.createPackage)
  const action = useStore((state) => state.action)
  const setAction = useStore((state) => state.setAction)
  const setDialog = useStore((state) => state.setDialog)
  const isCreate = action === 'create/package'
  const resetAction = () => {
    setAction(undefined)
    setDialog(undefined)
  }
  React.useEffect(() => {
    if (isCreate) {
      createPackage().finally(resetAction)
    }
  }, [action])
  return null
}
