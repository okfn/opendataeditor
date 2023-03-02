import * as React from 'react'
import Box from '@mui/material/Box'
import FieldsTree from '../../Parts/Trees/FieldsTree'
import { useStore } from './store'

export default function Fields() {
  const fieldTree = useStore((state) => state.fieldTree)
  const editor = useStore((state) => state.editor)

  if (!fieldTree) return null
  return (
    <Box sx={{ marginTop: 2, border: 'solid 1px #ccc', height: '100%' }}>
      <FieldsTree tree={fieldTree} editor={editor} />
    </Box>
  )
}
