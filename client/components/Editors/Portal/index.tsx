import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import Layout from './Layout'
import * as types from '../../../types'

export interface PortalProps {
  portal?: types.IPortal
  onChange?: (portal: types.IPortal) => void
}

export default function Portal(props: PortalProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
  )
}
