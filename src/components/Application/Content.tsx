import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Tabs from '../Parts/Tabs'
import File from '../Controllers/File'
import Metadata from '../Controllers/Metadata'
import Table from '../Controllers/Table'
import Report from '../Controllers/Report'
import Source from '../Controllers/Source'
import Chart from '../Controllers/Chart'
import Sql from '../Controllers/Sql'
import { useStore } from './store'
import * as settings from '../../settings'

const TEXT_FORMATS = ['csv', 'txt', 'md']
const METADATA_FORMATS = ['json', 'yaml']

export default function Layout() {
  const record = useStore((state) => state.record)
  if (!record) return null
  switch (record.type) {
    case 'table':
      return <LayoutTable />
    case 'file':
      if (record.path === settings.PACKAGE_PATH) return <LayoutPackage />
      if (METADATA_FORMATS.includes(record.resource.format)) return <LayoutMetadata />
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
        <File client={client} record={record} />
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
        <File client={client} record={record} />
      </Tabs>
    </Box>
  )
}

function LayoutMetadata() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  if (!record) return null
  let type:
    | 'package'
    | 'resource'
    | 'dialect'
    | 'schema'
    | 'checklist'
    | 'pipeline'
    | undefined
  if (record.resource.path.endsWith('datapackage.json')) type = 'package'
  if (record.resource.path.endsWith('package.json')) type = 'package'
  if (record.resource.path.endsWith('resource.json')) type = 'resource'
  if (record.resource.path.endsWith('dialect.json')) type = 'dialect'
  if (record.resource.path.endsWith('schema.json')) type = 'schema'
  if (record.resource.path.endsWith('checklist.json')) type = 'checklist'
  if (record.resource.path.endsWith('pipeline.json')) type = 'pipeline'
  if (!type) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={[capitalize(type)]}>
        <Metadata client={client} record={record} type={type} />
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
      <Tabs labels={['Package', 'Report', 'SQL']}>
        <Metadata
          type="package"
          client={client}
          record={record}
          onPathChange={selectPath}
        />
        <Report client={client} record={record} />
        <Sql client={client} />
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
        <Table client={client} record={record} />
        <Report client={client} record={record} />
        <Source client={client} record={record} />
        <Chart client={client} />
        <Sql client={client} />
      </Tabs>
    </Box>
  )
}
