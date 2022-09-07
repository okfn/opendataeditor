import * as React from 'react'
import { Provider, makeStore } from './store'
import { ISession } from '../../interfaces'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface ContentProps {
  session?: ISession
  path: string
}

export default function Content(props: ContentProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
