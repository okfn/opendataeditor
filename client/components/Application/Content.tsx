import * as React from 'react'
import Box from '@mui/material/Box'
import { ControllerProps } from '../Controllers/Base'
import { ErrorBoundary } from 'react-error-boundary'
import File from '../Controllers/File'
import Metadata from '../Controllers/Metadata'
import Chart from '../Controllers/Chart'
import Table from '../Controllers/Table'
import Text from '../Controllers/Text'
import View from '../Controllers/View'
import EmptyCard from '../Parts/Cards/Empty'
import SpinnerCard from '../Parts/Cards/Spinner'
import * as store from '@client/store'
import { client } from '@client/client'

export default function Content() {
  const record = store.useStore((state) => state.record)
  const indexing = store.useStore((state) => state.indexing)
  const path = store.useStore((state) => state.path)

  return indexing ? (
    <LoadingContent />
  ) : record && path ? (
    <FileContent />
  ) : (
    <EmptyContent />
  )
}

function FileContent() {
  const record = store.useStore((state) => state.record)
  if (!record) return null

  const Controller = CONTROLLERS[record.type] || File
  const handleUpdate = React.useMemo(
    () => () => store.onFilePatch(record.path),
    [record.path]
  )

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ padding: 2.5, color: '#555' }}>
          <strong>Failed to open the file</strong>. Please{' '}
          <a href="https://github.com/okfn/opendataeditor/issues" target="_blank">
            create an issue
          </a>{' '}
          sharing the file contents <small>(if possible)</small>
        </Box>
      }
    >
      <Controller
        path={record.path}
        client={client}
        onSave={handleUpdate}
        onSaveAs={(path) => store.onFileCreate([path])}
      />
    </ErrorBoundary>
  )
}

function EmptyContent() {
  return (
    <EmptyCard title="No Files Selected" description="Select a file in the left menu" />
  )
}

function LoadingContent() {
  return <SpinnerCard message="Loading" />
}

export const CONTROLLERS: {
  [type: string]: React.ElementType<ControllerProps>
} = {
  article: Text,
  chart: Chart,
  dialect: Metadata,
  file: File,
  image: File,
  json: Text,
  jsonschema: Text,
  map: File,
  package: Metadata,
  resource: Metadata,
  schema: Metadata,
  script: Text,
  table: Table,
  text: Text,
  view: View,
}
