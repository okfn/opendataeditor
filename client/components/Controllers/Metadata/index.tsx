import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ControllerProps } from '../../Controllers/Base'
import Layout from './Layout'

export interface MetadataProps extends ControllerProps {}

export default function Metadata(props: MetadataProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
