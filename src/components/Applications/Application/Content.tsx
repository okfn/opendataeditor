import * as React from 'react'
import Box from '@mui/material/Box'
import File from '../../Controllers/File'
import Empty from '../../Parts/Empty'
import { useStore } from './store'
import * as settings from './settings'

export default function Content() {
  const file = useStore((state) => state.file)
  return <Box height="100%">{file ? <ContentFile /> : <ContentEmpty />}</Box>
}

function ContentFile() {
  const file = useStore((state) => state.file)
  const client = useStore((state) => state.client)
  const saveAs = useStore((state) => state.saveAs)
  const save = useStore((state) => state.save)
  if (!file) return null
  const Controller = settings.RESOURCE_CONTROLLERS[file.type] || File
  return <Controller path={file.path} client={client} onSaveAs={saveAs} onSave={save} />
}

function ContentEmpty() {
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}
