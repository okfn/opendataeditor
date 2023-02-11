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

export default function Content() {
  const file = useStore((state) => state.file)
  return <Box>{file ? <ContentFile /> : <ContentEmpty />}</Box>
}

function ContentFile() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  assert(file)
  let Controller = File
  if (file.type === 'view') Controller = View
  if (file.type === 'chart') Controller = Chart
  if (file.type === 'table') Controller = Table
  if (file.type === 'package') Controller = Package
  if (settings.METADATA_TYPES.includes(file.type)) Controller = Metadata
  return <Controller client={client} file={file} />
}

function ContentEmpty() {
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}
