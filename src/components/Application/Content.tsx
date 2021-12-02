import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '../Table'
import { useStore } from './store'

export default function Content() {
  const text = useStore((state) => state.text)
  const rows = useStore((state) => state.rows)
  const resource = useStore((state) => state.resource)
  return (
    <Box>
      {resource && rows && text ? (
        <Table schema={resource.schema} rows={rows} text={text} />
      ) : (
        <div>loading</div>
      )}
    </Box>
  )
}
