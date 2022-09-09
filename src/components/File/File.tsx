import * as React from 'react'
import { Provider, makeStore } from './store'
import { Client } from '../../client'
import Layout from './Layout'

export interface FileProps {
  client: Client
  path: string
}

export default function File(props: FileProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
