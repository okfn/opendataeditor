import * as React from 'react'
import { Provider, makeStore } from './store'
import { Client } from '../../client'
import Layout from './Layout'

export interface BrowserProps {
  client: Client
  path?: string
}

export default function Browser(props: BrowserProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
