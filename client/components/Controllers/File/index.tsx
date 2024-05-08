import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ControllerProps } from '../../Controllers/Base'
import Layout from './Layout'

export interface FileProps extends ControllerProps {}

export default function File(props: FileProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
