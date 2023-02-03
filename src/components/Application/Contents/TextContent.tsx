import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import File from '../../Controllers/File'
import { useStore } from '../store'

export default function TextContent() {
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
