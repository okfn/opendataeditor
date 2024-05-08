import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ControllerProps } from '../../Controllers/Base'
import Layout from './Layout'

export interface TableProps extends ControllerProps {}

export default function Table(props: TableProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
