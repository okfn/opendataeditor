import * as React from 'react'
import Empty from '../../Parts/Empty'
import Spinner from '../../Parts/Spinner'
import FileTree from '../../Parts/Trees/File'
import Alert, { AlertColor } from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Close from '@mui/icons-material/Close'
import { useStore, selectors } from './store'

export default function Editor() {
  const fileItems = useStore((state) => state.fileItems)
  const loading = useStore((state) => state.loading)
  return loading ? (
    <LoadingContent />
  ) : fileItems.length ? (
    <FilesContent />
  ) : (
    <EmptyContent />
  )
}

function LoadingContent() {
  return <Spinner />
}

function FilesContent() {
  const path = useStore((state) => state.path)
  const fileTree = useStore(selectors.fileTree)
  const setPath = useStore((state) => state.setPath)
  const addedPath = useStore((state) => state.addedPath)
  const message = useStore((state) => state.message)
  const setMessage = useStore((state) => state.setMessage)
  const open = message && true
  return (
    <React.Fragment>
      <FileTree
        tree={fileTree}
        added={addedPath}
        selected={path}
        onPathChange={setPath}
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
