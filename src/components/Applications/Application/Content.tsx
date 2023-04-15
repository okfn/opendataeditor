import * as React from 'react'
import Box from '@mui/material/Box'
import Empty from '../../Parts/Empty'
import File from '../../Controllers/File'
import Table from '../../Controllers/Table'
import Package from '../../Controllers/Package'
import Metadata from '../../Controllers/Metadata'
import Chart from '../../Controllers/Chart'
import View from '../../Controllers/View'
import { ResourceControllerProps } from '../../Parts/Controller/Resource'
import { useStore } from './store'
import Text from '../../Controllers/Text'

export default function Content() {
  const file = useStore((state) => state.file)
  return <Box height="100%">{file ? <ContentFile /> : <ContentEmpty />}</Box>
}

function ContentFile() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  const onSaveAs = (path: string) => {
    console.log('saveAs', path)
  }
  const onSave = () => {
    console.log('save')
  }
  if (!file) return null
  const Controller = CONTROLLERS[file.type] || File
  return <Controller file={file} client={client} onSaveAs={onSaveAs} onSave={onSave} />
}

function ContentEmpty() {
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}

const CONTROLLERS: { [type: string]: React.ElementType<ResourceControllerProps> } = {
  chart: Chart,
  file: File,
  json: Text,
  metadata: Metadata,
  package: Package,
  table: Table,
  text: Text,
  view: View,
}
