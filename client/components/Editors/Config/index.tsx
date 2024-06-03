import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import Layout from './Layout'
import * as types from '../../../types'

export interface ConfigProps {
  config?: types.IConfig
  defaultSection?: string
  onChange?: (config: types.IConfig) => void
}

export default function Config(props: ConfigProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
