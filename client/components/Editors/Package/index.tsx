import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import * as types from '../../../types'
import Layout from './Layout'

export interface PackageProps {
  package?: types.IPackage
  shallow?: boolean
  onChange?: (pkg: types.IPackage) => void
  onAddResource?: () => void
  onResourceSelected?: (name?: string) => void
}

export default function Package(props: PackageProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
