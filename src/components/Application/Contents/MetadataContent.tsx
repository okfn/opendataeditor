import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import Metadata from '../../Controllers/Metadata'
import { useStore } from '../store'

export default function MetadataContent() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  if (!file) return null
  let type:
    | 'package'
    | 'resource'
    | 'dialect'
    | 'schema'
    | 'checklist'
    | 'pipeline'
    | undefined
  if (file.record) {
    if (file.record.resource.path.endsWith('datapackage.json')) type = 'package'
    if (file.record.resource.path.endsWith('package.json')) type = 'package'
    if (file.record.resource.path.endsWith('resource.json')) type = 'resource'
    if (file.record.resource.path.endsWith('dialect.json')) type = 'dialect'
    if (file.record.resource.path.endsWith('schema.json')) type = 'schema'
    if (file.record.resource.path.endsWith('checklist.json')) type = 'checklist'
    if (file.record.resource.path.endsWith('pipeline.json')) type = 'pipeline'
  }
  if (!type) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={[capitalize(type)]}>
        <Metadata client={client} file={file} type={type} />
      </Tabs>
    </Box>
  )
}
