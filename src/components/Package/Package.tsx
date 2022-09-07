import * as React from 'react'
import { IPackage } from '../../interfaces'
import { Provider, makeStore } from './store'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface PackageProps {
  descriptor?: IPackage
  onCommit?: (descriptor: IPackage) => void
  onRevert?: (descriptor: IPackage) => void
}

export default function Package(props: PackageProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
