import * as React from 'react'
import File from '../../Controllers/File'
import Empty from '../../Parts/Empty'
import Spinner from '../../Parts/Spinner'
import { useStore } from './store'
import * as settings from './settings'

export default function Controller() {
  const record = useStore((state) => state.record)
  const indexing = useStore((state) => state.indexing)
  return indexing ? (
    <LoadingController />
  ) : record ? (
    <FileController />
  ) : (
    <EmptyController />
  )
}

function FileController() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  const onCreate = useStore((state) => state.onCreate)
  const onUpdate = useStore((state) => state.onUpdate)
  if (!record) return null
  const Controller = settings.CONTROLLERS[record.type] || File
  const handleUpdate = React.useMemo(() => () => onUpdate(record.path), [record.path])
  return (
    <Controller
      path={record.path}
      client={client}
      onSave={handleUpdate}
      onSaveAs={onCreate}
    />
  )
}

function EmptyController() {
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}

function LoadingController() {
  return <Spinner message="Indexing file" />
}
