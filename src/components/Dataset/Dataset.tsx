import * as React from 'react'
import { Provider, makeStore } from './store'
import { Client } from '../../client'
import Layout from './Layout'

export interface DatasetProps {
  client: Client
  path: string
}

export default function Dataset(props: DatasetProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
