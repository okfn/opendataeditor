import * as React from 'react'
import { Provider, makeStore } from './store'
import { Client } from '../../client'
import Layout from './Layout'

export interface TableProps {
  client: Client
  path: string
}

export default function Table(props: TableProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
