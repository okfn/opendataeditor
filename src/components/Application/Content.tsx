import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../Views/Library/Tabs'
import FileEditor from '../Editors/File'
import PackageEditor from '../Editors/Package'
import TableEditor from '../Editors/Table'
import ReportEditor from '../Editors/Report'
import SourceEditor from '../Editors/Source'
import ChartEditor from '../Editors/Chart'
import SqlEditor from '../Editors/Sql'
import { useStore } from './store'
import * as settings from '../../settings'

const TEXT_FORMATS = ['csv', 'txt', 'md']

export default function Layout() {
  const record = useStore((state) => state.record)
  if (!record) return null
  switch (record.type) {
    case 'table':
      return <LayoutTable />
    case 'file':
      if (record.path === settings.PACKAGE_PATH) return <LayoutPackage />
      if (TEXT_FORMATS.includes(record.resource.format)) return <LayoutText />
      return <LayoutFile />
    default:
      return null
  }
}

function LayoutFile() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Image']}>
        <FileEditor client={client} record={record} />
      </Tabs>
    </Box>
  )
}

function LayoutText() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Text']}>
        <FileEditor client={client} record={record} />
      </Tabs>
    </Box>
  )
}

function LayoutPackage() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  const selectPath = useStore((state) => state.selectPath)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Package', 'Source', 'SQL']}>
        <PackageEditor client={client} record={record} onPathChange={selectPath} />
        <SourceEditor client={client} record={record} />
        <SqlEditor client={client} />
      </Tabs>
    </Box>
  )
}

function LayoutTable() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Table', 'Report', 'Source', 'Chart', 'SQL']}>
        <TableEditor client={client} record={record} />
        <ReportEditor client={client} record={record} />
        <SourceEditor client={client} record={record} />
        <ChartEditor client={client} />
        <SqlEditor client={client} />
      </Tabs>
    </Box>
  )
}
