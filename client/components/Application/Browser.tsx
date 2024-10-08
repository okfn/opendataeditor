import Box from '@mui/material/Box'
import { ErrorBoundary } from 'react-error-boundary'
import SpinnerCard from '../Parts/Cards/Spinner'
import FileTree from '../Parts/Trees/File'
import Button from '@mui/material/Button'
import * as store from '@client/store'
import createFolderIcon from '../../assets/create_folder_icon.svg'

export default function Browser() {
  const files = store.useStore((state) => state.files)
  const loading = store.useStore((state) => state.loading)

  return loading ? (
    <LoadingBrowser />
  ) : files.length ? (
    <DefaultBrowser />
  ) : (
    <EmptyBrowser />
  )
}

function DefaultBrowser() {
  const path = store.useStore((state) => state.path)
  const files = store.useStore((state) => state.files)
  const event = store.useStore((state) => state.event)

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ color: '#555' }}>
          <strong>Failed to open the project</strong>. Please{' '}
          <a href="https://github.com/okfn/opendataeditor/issues" target="_blank">
            create an issue
          </a>{' '}
          sharing the project details <small>(if possible)</small>
        </Box>
      }
    >
      <Button
        color="OKFNCoolGray"
        sx={{ textTransform: 'none', marginLeft: '20px', justifyContent: 'flex-start' }}
        startIcon={<img src={createFolderIcon} alt="" />}
        onClick={() => store.openDialog('addEmptyFolder')}
      >
        Create folder
      </Button>
      <FileTree
        files={files}
        event={event}
        selected={path}
        onSelect={(path) => store.selectFile({ path })}
      />
    </ErrorBoundary>
  )
}

function EmptyBrowser() {
  return <Box />
}

function LoadingBrowser() {
  return <SpinnerCard message="Loading" />
}
