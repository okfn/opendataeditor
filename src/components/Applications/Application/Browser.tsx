import * as React from 'react'
import Box from '@mui/material/Box'
import Files from '../../Controllers/Files'
import { useStore } from './store'

export default function Layout() {
  const client = useStore((state) => state.client)
  const select = useStore((state) => state.select)
  const addedPath = useStore((state) => state.addedPath)
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Files
        client={client}
        addedPath={addedPath}
        onPathChange={(path) => select(path)}
      />
    </Box>
  )
}
