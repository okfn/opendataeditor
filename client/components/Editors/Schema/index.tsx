import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import Layout from './Layout'
import * as types from '../../../types'

export interface SchemaProps {
  schema?: types.ISchema
  externalMenu?: { section: string }
  onChange?: (schema: types.ISchema) => void
  onFieldSelected?: (name?: string) => void
}

export default function Schema(props: SchemaProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
