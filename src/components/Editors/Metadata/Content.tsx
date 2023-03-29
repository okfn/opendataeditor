import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Package from '../Package'
import Resource from '../Resource'
import Dialect from '../Dialect'
import Schema from '../Schema'
import DefaultPreview from '../../Parts/Preview'
import Columns from '../../Parts/Columns'
import { IPackage, IResource, IDialect, ISchema } from '../../../interfaces'
import { useStore } from './store'

// TODO: why Editor re-render on a "Preview" button click?
export default function Content() {
  return (
    <Layout>
      <Editor />
    </Layout>
  )
}

function Layout(props: React.PropsWithChildren<{}>) {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 8)})`
  const isPreview = useStore((state) => state.isPreview)
  return (
    <Box sx={{ height }}>
      {isPreview ? (
        <Box sx={{ backgroundColor: '#333' }}>
          <Columns spacing={2} layout={[9, 3]}>
            <Box sx={{ height, backgroundColor: '#fff' }}>{props.children}</Box>
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
        props.children
      )}
    </Box>
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
          package={descriptor as IPackage}
          onChange={(descriptor) => updateState({ descriptor })}
        />
      )
    case 'resource':
      return (
        <Resource
          resource={descriptor as IResource}
          onChange={(descriptor) => updateState({ descriptor })}
        />
      )
    case 'dialect':
      return (
        <Dialect
          dialect={descriptor as IDialect}
          onChange={(descriptor) => updateState({ descriptor })}
        />
      )
    case 'schema':
      return (
        <Schema
          schema={descriptor as ISchema}
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
