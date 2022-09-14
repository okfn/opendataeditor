import * as React from 'react'
import Box from '@mui/material/Box'
import Package from '../../Package'
import Editor from '../Editor'
import { useStore } from '../store'

export default function DataView() {
  const updatePackage = useStore((state) => state.updatePackage)
  return (
    <Box>
      <Editor />
      <Box sx={{ borderTop: 'solid 1px #ddd' }}>
        <Package withTabs={true} onCommit={updatePackage} />
      </Box>
    </Box>
  )
}
