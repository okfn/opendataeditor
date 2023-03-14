import * as React from 'react'
import Empty from '../../Parts/Empty'
import SpinnerContent from '../../Parts/SpinnerContent'
import FileTree from '../../Parts/Trees/FileTree'
import { useStore, selectors } from './store'
import { Alert, AlertColor, IconButton, Snackbar } from '@mui/material'
import { Close } from '@mui/icons-material'

export default function Content() {
  const fileItems = useStore((state) => state.fileItems)
  const loading = useStore((state) => state.loading)
  return loading ? (
    <SpinnerContent />
  ) : fileItems.length ? (
    <FilesContent />
  ) : (
    <EmptyContent />
  )
}

function FilesContent() {
  const path = useStore((state) => state.path)
  const fileTree = useStore(selectors.fileTree)
  const setPath = useStore((state) => state.setPath)
  const fileItemAdded = useStore((state) => state.fileItemAdded)
  const setFileItemAdded = useStore((state) => state.setFileItemAdded)
  const folderPath = useStore(selectors.folderPath)
  const message = useStore((state) => state.message)
  const setMessage = useStore((state) => state.setMessage)
  const open = message && true
  return (
    <React.Fragment>
      <FileTree
        tree={fileTree}
        selected={path}
        folderPath={folderPath}
        onPathChange={setPath}
        fileItemAdded={fileItemAdded}
        onFileItemAdd={setFileItemAdded}
      />
      {open && (
        <Snackbar
          open={open}
          onClose={() => setMessage(undefined)}
          autoHideDuration={6000}
        >
          <Alert
            variant="filled"
            elevation={3}
            severity={message.status as AlertColor}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setMessage(undefined)}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {message.description}
          </Alert>
        </Snackbar>
      )}
    </React.Fragment>
  )
}

function EmptyContent() {
  return <Empty title="No Files Added" description='Use "Create" button to add files' />
}
