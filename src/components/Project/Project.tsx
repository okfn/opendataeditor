import * as React from 'react'
import { Provider, makeStore } from './store'
import Layout from './Layout'
import { ISession } from '../../interfaces'

export interface ProjectProps {
  session?: ISession
  onPathChange: (path?: string) => void
}

export default function Schema(props: ProjectProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
