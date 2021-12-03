import * as React from 'react'
import Box from '@mui/material/Box'
import { ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'

// TODO: rebase on theme.spacing
// TODO: remove borderTop hack
// TODO: rename to handleCommit/Revert?

export interface SchemaProps {
  descriptor: ISchema
  handleCommit?: (descriptor: ISchema) => void
  handleRevert?: (descriptor: ISchema) => void
}

export default function Schema(props: SchemaProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box sx={{ height: '464px' }}>
        <Box sx={{ height: '400px', borderTop: 'solid 1px white' }}>
          <Editor />
        </Box>
        <Box sx={{ height: '64px' }}>
          <Actions />
        </Box>
      </Box>
    </Provider>
  )
}
