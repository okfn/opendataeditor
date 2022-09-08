import * as React from 'react'
import { Provider, makeStore } from './store'
import { ISession } from '../../interfaces'
import Layout from './Layout'

export interface TableProps {
  session?: ISession
  path: string
}

export default function Table(props: TableProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
