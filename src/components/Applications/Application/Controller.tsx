import * as React from 'react'
import Box from '@mui/material/Box'
import File from '../../Controllers/File'
import Empty from '../../Parts/Empty'
import { useStore } from './store'
import * as settings from './settings'

export default function Controller() {
  const file = useStore((state) => state.file)
  return <Box height="100%">{file ? <FileController /> : <EmptyController />}</Box>
}

function FileController() {
  const file = useStore((state) => state.file)
  const client = useStore((state) => state.client)
  const revert = useStore((state) => state.revert)
  const onCreate = useStore((state) => state.onCreate)
  const onUpdate = useStore((state) => state.onUpdate)
  const fileEvent = useStore((state) => state.fileEvent)
  if (!file) return null
  const Controller = settings.CONTROLLERS[file.type] || File
  return (
    <Controller
      path={file.path}
      client={client}
      isDraft={fileEvent?.type === 'draft'}
      onSave={() => onUpdate(file.path)}
      onSaveAs={onCreate}
      onRevert={revert}
    />
  )
}

function EmptyController() {
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}
