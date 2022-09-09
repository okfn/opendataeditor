import * as React from 'react'
import { ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface SchemaProps {
  schema?: ISchema
  onCommit?: (schema: ISchema) => void
  onRevert?: (schema: ISchema) => void
}

export default function Schema(props: SchemaProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
