import * as React from 'react'
import Box from '@mui/material/Box'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import PreviewPanel from './Panels/Preview'
import Actions from './Actions'
import { IResource, IDialect, ISchema } from '../../../interfaces'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + panelHeight)})`
  const type = useStore((state) => state.file.type)
  const path = useStore((state) => state.file.path)
  const descriptor = useStore((state) => state.descriptor)
  const updateState = useStore((state) => state.updateState)
  const loadDescriptor = useStore((state) => state.loadDescriptor)
  React.useEffect(() => {
    loadDescriptor().catch(console.error)
  }, [path])
  if (!descriptor) return null
  return (
    <Box sx={{ height }}>
      <Box sx={{ height: contentHeight }}>
        {type === 'resource' && (
          <Resource
            resource={descriptor as IResource}
            onChange={(descriptor) => updateState({ descriptor })}
          />
        )}
        {type === 'dialect' && (
          <Dialect
            dialect={descriptor as IDialect}
            onChange={(descriptor) => updateState({ descriptor })}
          />
        )}
        {type === 'schema' && (
          <Schema
            schema={descriptor as ISchema}
            onChange={(descriptor) => updateState({ descriptor })}
          />
        )}
      </Box>
      <Box
        hidden={!panel}
        sx={{
          overflowY: 'hidden',
          height: theme.spacing(48),
          borderTop: 1,
          borderColor: 'divider',
          padding: 2,
          backgroundColor: '#333',
          color: '#eee',
          fontSize: '80%',
        }}
      >
        {panel === 'preview' && <PreviewPanel />}
      </Box>
      <Box sx={{ height: theme.spacing(8) }}>
        <Actions />
      </Box>
    </Box>
  )
}
