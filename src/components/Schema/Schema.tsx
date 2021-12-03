import * as React from 'react'
import Box from '@mui/material/Box'
import { ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'

// TODO: rename to handleCommit/Revert?

export interface SchemaProps {
  descriptor: ISchema
  onCommit?: (descriptor: ISchema) => void
  onRevert?: (descriptor: ISchema) => void
}

export default function Schema(props: SchemaProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box sx={{ height: '464px' }}>
        <Editor />
        <Actions />
      </Box>
    </Provider>
  )
}
