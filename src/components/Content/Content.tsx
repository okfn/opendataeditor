import * as React from 'react'
import { Provider, makeStore } from './store'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface ContentProps {
  path: string
}

export default function Content(props: ContentProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
