import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import Box from '@mui/material/Box'
import Resource from '../../Resource'
import Editor from '../Editor'
import { useStore } from '../store'

export default function DataView() {
  const resource = useStore((state) => state.resource)
  const updateResource = useStore((state) => state.updateResource)
  return (
    <Box>
      <Editor />
      <Box sx={{ borderTop: 'solid 1px #ddd' }}>
        <Resource descriptor={resource} withTabs={true} onCommit={updateResource} />
      </Box>
    </Box>
  )
}
