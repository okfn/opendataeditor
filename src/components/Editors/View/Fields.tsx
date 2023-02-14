import * as React from 'react'
import Box from '@mui/material/Box'
import BaseTree from '../../Parts/Trees/BaseTree'
import { useStore } from './store'

export default function Fields() {
  const fieldTree = useStore((state) => state.fieldTree)
  if (!fieldTree) return null
  return (
    <Box sx={{ marginTop: 2, border: 'solid 1px #ccc', height: '100%' }}>
      <BaseTree tree={fieldTree} />
    </Box>
  )
}
