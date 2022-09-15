import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../Views/Library/Tabs'
import TableEditor from '../Editors/Table'
import ReportEditor from '../Editors/Report'
import SourceEditor from '../Editors/Source'
import ChartEditor from '../Editors/Chart'
import SqlEditor from '../Editors/Sql'
import { useStore } from './store'

export default function Layout() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Data', 'Metadata', 'Report', 'Source', 'Chart', 'SQL']}>
        <TableEditor client={client} record={record} />
        <TableEditor client={client} record={record} isMetadata={true} />
        <ReportEditor client={client} record={record} />
        <SourceEditor client={client} record={record} />
        <ChartEditor client={client} />
        <SqlEditor client={client} />
      </Tabs>
    </Box>
  )
}
