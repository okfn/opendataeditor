import * as React from 'react'
import { ControllerProps } from '../Controllers/Base'
import File from '../Controllers/File'
import Metadata from '../Controllers/Metadata'
import Chart from '../Controllers/Chart'
import Table from '../Controllers/Table'
import Text from '../Controllers/Text'
import View from '../Controllers/View'
import Empty from '../Parts/Empty'
import Spinner from '../Parts/Spinner'
import { useStore } from './store'

export default function Content() {
  const record = useStore((state) => state.record)
  const indexing = useStore((state) => state.indexing)
  return indexing ? <LoadingContent /> : record ? <FileContent /> : <EmptyContent />
}

function FileContent() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  const onFileCreate = useStore((state) => state.onFileCreate)
  const onFilePatch = useStore((state) => state.onFilePatch)
  if (!record) return null
  const Controller = CONTROLLERS[record.type] || File
  const handleUpdate = React.useMemo(() => () => onFilePatch(record.path), [record.path])
  return (
    <Controller
      path={record.path}
      client={client}
      onSave={handleUpdate}
      onSaveAs={(path) => onFileCreate([path])}
    />
  )
}

function EmptyContent() {
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}

function LoadingContent() {
  return <Spinner message="Indexing" />
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
