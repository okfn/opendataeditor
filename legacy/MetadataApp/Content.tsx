import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Package from '../../Editors/Package'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import DefaultPreview from '../../Parts/Preview'
import Columns from '../../Parts/Columns'
import ScrollBox from '../../Parts/ScrollBox'
import { useStore } from './store'
import * as types from '../../../types'

export default function Content() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 8)})`
  const isPreview = useStore((state) => state.isPreview)
  return (
    <ScrollBox sx={{ height }}>
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
    </ScrollBox>
  )
}

function Editor() {
  const editor = useStore((state) => state.editor)
  const descriptor = useStore((state) => state.descriptor)
  const updateState = useStore((state) => state.updateState)
  switch (editor) {
    case 'package':
      return (
        <Package
          package={descriptor as types.IPackage}
          onChange={(descriptor) => updateState({ descriptor })}
        />
      )
    case 'resource':
      return (
        <Resource
          resource={descriptor as types.IResource}
          onChange={(descriptor) => updateState({ descriptor })}
        />
      )
    case 'dialect':
      return (
        <Dialect
          dialect={descriptor as types.IDialect}
          onChange={(descriptor) => updateState({ descriptor })}
        />
      )
    case 'schema':
      return (
        <Schema
          schema={descriptor as types.ISchema}
          onChange={(descriptor) => updateState({ descriptor })}
        />
      )
    default:
      return null
  }
}

function Preview() {
  const descriptor = useStore((state) => state.descriptor)
  const revision = useStore((state) => state.revision)
  return (
    <DefaultPreview format="json" descriptor={descriptor || {}} revision={revision} />
  )
}
