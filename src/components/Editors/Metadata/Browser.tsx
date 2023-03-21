import * as React from 'react'
import Box from '@mui/material/Box'
import FileTree from '../../Parts/Trees/FileTree'
import { useStore, IEditorState } from './store'

const TREE = [
  {
    name: 'Metadata',
    path: 'metadata',
    type: 'folder',
    children: [
      { name: 'Package', path: 'metadata/package', type: 'package', children: [] },
      { name: 'Resource', path: 'metadata/resource', type: 'resource', children: [] },
      { name: 'Dialect', path: 'metadata/dialect', type: 'dialect', children: [] },
      { name: 'Schema', path: 'metadata/schema', type: 'schema', children: [] },
    ],
  },
]

export default function Layout() {
  const path = useStore((state) => state.editorState.path)
  const updateEditorState = useStore((state) => state.updateEditorState)
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <FileTree
        tree={TREE}
        selected={path}
        onPathChange={(path) => {
          updateEditorState({ path: path as IEditorState['path'] })
        }}
      />
    </Box>
  )
}
