import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { IPipeline, ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'

// TODO: remove borderTop hack

export interface PipelineProps {
  descriptor?: IPipeline
  schema?: ISchema
  onCommit?: (descriptor: IPipeline) => void
  onRevert?: (descriptor: IPipeline) => void
}

export default function Pipeline(props: PipelineProps) {
  const theme = useTheme()
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box sx={{ height: theme.spacing(56) }}>
        <Box sx={{ height: theme.spacing(48), borderTop: 'solid 1px white' }}>
          <Editor />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </Provider>
  )
}
