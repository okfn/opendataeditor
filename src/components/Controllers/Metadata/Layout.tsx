import * as React from 'react'
import Box from '@mui/material/Box'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import PreviewPanel from './Panels/Preview'
import ScrollBox from '../../Parts/ScrollBox'
import Dialog from './Dialog'
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
  const file = useStore((state) => state.file)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  const loadDescriptor = useStore((state) => state.loadDescriptor)
  React.useEffect(() => {
    loadDescriptor().catch(console.error)
  }, [file])
  if (!modified) return null
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height }}>
        <ScrollBox height={contentHeight}>
          {file.type === 'resource' && (
            <Resource
              resource={modified as IResource}
              onChange={(descriptor) => updateState({ modified: descriptor })}
            />
          )}
          {file.type === 'dialect' && (
            <Dialect
              dialect={modified as IDialect}
              onChange={(descriptor) => updateState({ modified: descriptor })}
            />
          )}
          {file.type === 'schema' && (
            <Schema
              schema={modified as ISchema}
              onChange={(descriptor) => updateState({ modified: descriptor })}
            />
          )}
        </ScrollBox>
        <Box
          hidden={!panel}
          sx={{
            overflowY: 'hidden',
            height: theme.spacing(48),
            border: 'solid 3px #000',
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
    </React.Fragment>
  )
}
