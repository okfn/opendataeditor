import * as React from 'react'
import Box from '@mui/material/Box'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import { IResource, IDialect, ISchema } from '../../../interfaces'
import Actions from './Actions'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8)})`
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
      <Actions />
    </Box>
  )
}
