import * as React from 'react'
import { ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'

export interface SchemaProps {
  descriptor: ISchema
  onCommit?: (descriptor: ISchema) => void
  onRevert?: (descriptor: ISchema) => void
}

export default function Schema(props: SchemaProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Editor />
      <Actions />
    </Provider>
  )
}
