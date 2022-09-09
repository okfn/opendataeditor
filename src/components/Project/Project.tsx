import * as React from 'react'
import { Provider, makeStore } from './store'
import Layout from './Layout'
import { Client } from '../../client'

export interface ProjectProps {
  client: Client
  onPathChange: (path?: string) => void
}

export default function Schema(props: ProjectProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
