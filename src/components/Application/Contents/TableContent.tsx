import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import Table from '../../Controllers/Table'
import Report from '../../Controllers/Report'
import Source from '../../Controllers/Source'
import Chart from '../../Controllers/Chart'
import Sql from '../../Controllers/Sql'
import { useStore } from '../store'

export default function TableContent() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  if (!file) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Table', 'Report', 'Source', 'Chart', 'SQL']}>
        <Table client={client} file={file} />
        <Report client={client} file={file} />
        <Source client={client} file={file} />
        <Chart client={client} file={file} />
        <Sql client={client} file={file} />
      </Tabs>
    </Box>
  )
}
