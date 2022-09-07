import * as React from 'react'
import { IDialect } from '../../interfaces'
import { Provider, makeStore } from './store'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface DialectProps {
  descriptor?: IDialect
  onCommit?: (descriptor: IDialect) => void
  onRevert?: (descriptor: IDialect) => void
}

export default function Dialect(props: DialectProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
