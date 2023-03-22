import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Package from '../Package2'
import Resource from '../Resource2'
import Dialect from '../Dialect2'
import Schema from '../Schema2'
import Preview from '../../Parts/Preview'
import { IPackage, IResource, IDialect, ISchema } from '../../../interfaces'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 8)})`
  const isPreview = useStore((state) => state.editorState.isPreview)
  const descriptor = useStore((state) => state.editorState.descriptor)
  return (
    <Box sx={{ height }}>
      <Editor />
      {isPreview && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 3 }}>
          <Preview
            height={theme.spacing(42)}
            format="json"
            descriptor={descriptor || {}}
          />
        </Box>
      )}
    </Box>
  )
}

function Editor() {
  const editor = useStore((state) => state.editorState.editor)
  const descriptor = useStore((state) => state.editorState.descriptor)
  switch (editor) {
    case 'package':
      return <Package package={descriptor as IPackage} />
    case 'resource':
      return <Resource resource={descriptor as IResource} />
    case 'dialect':
      return <Dialect dialect={descriptor as IDialect} />
    case 'schema':
      return <Schema schema={descriptor as ISchema} />
    default:
      return null
  }
}
