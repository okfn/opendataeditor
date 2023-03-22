import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Package from '../Package2'
import Resource from '../Resource2'
import Dialect from '../Dialect2'
import Schema from '../Schema2'
import DefaultPreview from '../../Parts/Preview'
import Columns from '../../Parts/Columns'
import { IPackage, IResource, IDialect, ISchema } from '../../../interfaces'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 8)})`
  const isPreview = useStore((state) => state.editorState.isPreview)
  return (
    <Box sx={{ height }}>
      {isPreview ? (
        <Box sx={{ backgroundColor: '#333' }}>
          <Columns spacing={2} layout={[9, 3]}>
            <Box sx={{ height, backgroundColor: '#fff' }}>
              <Editor />
            </Box>
            <Box
              sx={{
                height,
                padding: 2,
                backgroundColor: '#333',
                color: '#eee',
                fontSize: '80%',
              }}
            >
              <Preview />
            </Box>
          </Columns>
        </Box>
      ) : (
        <Editor />
      )}
    </Box>
  )
}

function Editor() {
  const editor = useStore((state) => state.editorState.editor)
  const descriptor = useStore((state) => state.editorState.descriptor)
  const updateEditorState = useStore((state) => state.updateEditorState)
  switch (editor) {
    case 'package':
      return (
        <Package
          package={descriptor as IPackage}
          onChange={(descriptor) => updateEditorState({ descriptor })}
        />
      )
    case 'resource':
      return (
        <Resource
          resource={descriptor as IResource}
          onChange={(descriptor) => updateEditorState({ descriptor })}
        />
      )
    case 'dialect':
      return (
        <Dialect
          dialect={descriptor as IDialect}
          onChange={(descriptor) => updateEditorState({ descriptor })}
        />
      )
    case 'schema':
      return (
        <Schema
          schema={descriptor as ISchema}
          onChange={(descriptor) => updateEditorState({ descriptor })}
        />
      )
    default:
      return null
  }
}

function Preview() {
  const descriptor = useStore((state) => state.editorState.descriptor)
  const revision = useStore((state) => state.editorState.revision)
  return (
    <DefaultPreview format="json" descriptor={descriptor || {}} revision={revision} />
  )
}
