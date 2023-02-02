import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import Metadata from '../../Controllers/Metadata'
import { useStore } from '../store'

export default function MetadataContent() {
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
