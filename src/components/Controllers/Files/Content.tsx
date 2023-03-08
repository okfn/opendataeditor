import * as React from 'react'
import Empty from '../../Parts/Empty'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import SpinnerContent from '../../Parts/SpinnerContent'
import FileTree from '../../Parts/Trees/FileTree'
import { useStore, selectors } from './store'
import { Alert, AlertColor, IconButton, Snackbar } from '@mui/material'
import { Close } from '@mui/icons-material'

export default function Content() {
  const fileItems = useStore((state) => state.fileItems)
  const loading = useStore((state) => state.loading)
  console.log('loading', loading)
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
  const onMoveFile = useStore((state) => state.moveFileToPath)
  const open = message && true
  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <FileTree
          tree={fileTree}
          selected={path}
          folderPath={folderPath}
          onPathChange={setPath}
          onMoveFile={onMoveFile}
          fileItemAdded={fileItemAdded}
          onFileItemAdd={setFileItemAdded}
        />
      </DndProvider>
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
