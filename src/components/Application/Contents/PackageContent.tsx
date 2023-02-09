import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import Sql from '../../Controllers/Sql'
// TODO: recover
// import Report from '../../Controllers/Report'
import Metadata from '../../Controllers/Metadata'
import { useStore } from '../store'

export default function PackageContent() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  const selectFile = useStore((state) => state.selectFile)
  if (!file) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Package', 'SQL']}>
        <Metadata type="package" client={client} file={file} onPathChange={selectFile} />
        <Sql client={client} file={file} />
      </Tabs>
    </Box>
  )
}
