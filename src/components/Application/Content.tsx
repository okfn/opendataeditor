import * as React from 'react'
import { assert } from 'ts-essentials'
import Box from '@mui/material/Box'
import Empty from '../Parts/Empty'
import File from '../Controllers/File'
import Table from '../Controllers/Table'
import Package from '../Controllers/Package'
import Metadata from '../Controllers/Metadata'
import Chart from '../Controllers/Chart'
import View from '../Controllers/View'
import * as settings from '../../settings'
import { useStore } from './store'
// import Json from '../Controllers/Json'
import Text from '../Controllers/Text'

export default function Content() {
  const file = useStore((state) => state.file)
  return <Box height="100%">{file ? <ContentFile /> : <ContentEmpty />}</Box>
}

function ContentFile() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  const selectFile = useStore((state) => state.selectFile)
  const setFileItemAdded = useStore((state) => state.setFileItemAdded)
  assert(file)
  const onSave = (path: string) => {
    selectFile(path)
    setFileItemAdded(true)
  }
  let Controller = File
  if (file.type === 'view') Controller = View
  if (file.type === 'chart') Controller = Chart
  if (file.type === 'table') {
    return <Table client={client} file={file} onExport={onSave} />
  }
  if (file.type === 'json') {
    return <Text client={client} file={file} />
  }
  if (file.type === 'text') {
    return <Text client={client} file={file} />
  }
  if (file.type === 'package') Controller = Package
  if (settings.METADATA_TYPES.includes(file.type)) Controller = Metadata
  return <Controller client={client} file={file} />
}

function ContentEmpty() {
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}
