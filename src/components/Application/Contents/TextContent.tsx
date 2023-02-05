import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import File from '../../Controllers/File'
import { useStore } from '../store'

export default function TextContent() {
  const client = useStore((state) => state.client)
  const file = useStore((state) => state.file)
  if (!file) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Text']}>
        <File client={client} file={file} />
      </Tabs>
    </Box>
  )
}
