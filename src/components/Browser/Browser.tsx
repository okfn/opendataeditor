import * as React from 'react'
import { Provider, makeStore } from './store'
import { ISession } from '../../interfaces'
import Layout from './Layout'

export interface BrowserProps {
  session?: ISession
  path?: string
}

export default function Browser(props: BrowserProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
