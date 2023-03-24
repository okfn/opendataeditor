import * as React from 'react'
import Box from '@mui/material/Box'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import SourcePanel from './Panels/Source'
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
  const loadDescriptor = useStore((state) => state.loadDescriptor)
  React.useEffect(() => {
    loadDescriptor().catch(console.error)
  }, [path])
  if (!descriptor) return null
  return (
    <Box sx={{ height }}>
      <Box sx={{ height: contentHeight }}>
        {type === 'resource' && <Resource resource={descriptor as IResource} />}
        {type === 'dialect' && <Dialect dialect={descriptor as IDialect} />}
        {type === 'schema' && <Schema schema={descriptor as ISchema} />}
      </Box>
      <Box
        hidden={!panel}
        sx={{
          overflowY: 'auto',
          height: theme.spacing(48),
          borderTop: 1,
          borderColor: 'divider',
          padding: 2,
          backgroundColor: '#333',
          color: '#eee',
          fontSize: '80%',
        }}
      >
        {panel === 'source' && <SourcePanel />}
      </Box>
      <Box sx={{ height: theme.spacing(8) }}>
        <Actions />
      </Box>
    </Box>
  )
}
