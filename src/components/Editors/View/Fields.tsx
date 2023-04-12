import * as React from 'react'
import Box from '@mui/material/Box'
import FieldsTree from '../../Parts/Trees/FieldsTree'
import { useStore } from './store'

export default function Fields() {
  const fieldTree = useStore((state) => state.fieldTree)
  const editor = useStore((state) => state.editor)
  if (!fieldTree) return null
  return (
    <Box sx={{ borderLeft: 'solid 1px #ddd', height: '100%' }}>
      <FieldsTree
        tree={fieldTree}
        onFieldSelected={(name: string) => {
          if (editor && editor.current) {
            editor.current.editor.insert(`"${name}"`)
            editor.current.editor.focus()
          }
        }}
      />
    </Box>
  )
}
