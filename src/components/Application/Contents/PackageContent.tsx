import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import Sql from '../../Controllers/Sql'
import Report from '../../Controllers/Report'
import Metadata from '../../Controllers/Metadata'
import { useStore } from '../store'

export default function PackageContent() {
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  const selectResource = useStore((state) => state.selectResource)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Package', 'Report', 'SQL']}>
        <Metadata
          type="package"
          client={client}
          record={record}
          onPathChange={selectResource}
        />
        <Report client={client} record={record} />
        <Sql client={client} />
      </Tabs>
    </Box>
  )
}
