import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import * as types from '../../../types'
import Layout from './Layout'

export interface ResourceProps {
  resource?: types.IResource
  externalMenu?: { section: string }
  onChange?: (resource: types.IResource) => void
  onBackClick?: () => void
  onFieldSelected?: (name?: string) => void
}

export default function Resource(props: ResourceProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
  )
}
