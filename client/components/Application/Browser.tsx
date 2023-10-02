import * as React from 'react'
import Box from '@mui/material/Box'
import { ErrorBoundary } from 'react-error-boundary'
import EmptyCard from '../Parts/Cards/Empty'
import SpinnerCard from '../Parts/Cards/Spinner'
import FileTree from '../Parts/Trees/File'
import { useStore } from './store'

export default function Browser() {
  const files = useStore((state) => state.files)
  const loading = useStore((state) => state.loading)
  return loading ? (
    <LoadingBrowser />
  ) : files.length ? (
    <DefaultBrowser />
  ) : (
    <EmptyBrowser />
  )
}

function DefaultBrowser() {
  const path = useStore((state) => state.path)
  const files = useStore((state) => state.files)
  const fileEvent = useStore((state) => state.fileEvent)
  const selectFile = useStore((state) => state.selectFile)
  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ padding: 2.5, color: '#555' }}>
          <strong>Failed to open the project</strong>. Please{' '}
          <a href="https://github.com/okfn/opendataeditor/issues" target="_blank">
            create an issue
          </a>{' '}
          sharing the project details <small>(if possible)</small>
        </Box>
      }
    >
      <FileTree files={files} event={fileEvent} selected={path} onSelect={selectFile} />
    </ErrorBoundary>
  )
}

function EmptyBrowser() {
  return (
    <EmptyCard title="No Files Added" description='Use "Create" button to add files' />
  )
}

function LoadingBrowser() {
  return <SpinnerCard message="Loading" />
}
