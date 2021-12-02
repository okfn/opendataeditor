import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '../Table'
import Help from './Help'
import { useStore } from './store'

export default function Content() {
  const text = useStore((state) => state.text)
  const rows = useStore((state) => state.rows)
  const resource = useStore((state) => state.resource)
  return (
    <Box sx={{ p: 2 }}>
      {resource && rows && text ? (
        <Table schema={resource.schema} rows={rows} text={text} />
      ) : (
        <Help />
      )}
    </Box>
  )
}
