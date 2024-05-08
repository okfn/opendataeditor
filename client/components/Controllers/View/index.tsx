import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ControllerProps } from '../../Controllers/Base'
import Layout from './Layout'

export interface ViewProps extends ControllerProps {}

export default function View(props: ViewProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
