import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../Parts/Tabs'
import Empty from '../Parts/Empty'
import File from '../Controllers/File'
import Table from '../Controllers/Table'
import Package from '../Controllers/Package'
import Metadata from '../Controllers/Metadata'
import Chart from '../Controllers/Chart'
import Sql from '../Controllers/Sql'
import * as settings from '../../settings'
import { useStore } from './store'

export default function Content() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['File', 'SQL', 'Chart']}>
        <FileTab />
        <Sql client={client} file={file} />
        <Chart client={client} file={file} />
      </Tabs>
    </Box>
  )
}

function FileTab() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  if (file) {
    let FileController = File
    if (file.type === 'table') FileController = Table
    if (file.type === 'package') FileController = Package
    if (settings.METADATA_TYPES.includes(file.type)) FileController = Metadata
    return <FileController client={client} file={file} />
  }
  return <Empty title="No Files Selected" description="Select a file in the left menu" />
}
