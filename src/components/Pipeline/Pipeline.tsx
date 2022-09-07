import * as React from 'react'
import { IPipeline, ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface PipelineProps {
  descriptor?: IPipeline
  schema?: ISchema
  onCommit?: (descriptor: IPipeline) => void
  onRevert?: (descriptor: IPipeline) => void
}

export default function Pipeline(props: PipelineProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
