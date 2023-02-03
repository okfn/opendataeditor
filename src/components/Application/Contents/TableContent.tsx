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
  const record = useStore((state) => state.record)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Table', 'Report', 'Source', 'Chart', 'SQL']}>
        <Table client={client} record={record} />
        <Report client={client} record={record} />
        <Source client={client} record={record} />
        <Chart client={client} record={record} />
        <Sql client={client} record={record} />
      </Tabs>
    </Box>
  )
}
