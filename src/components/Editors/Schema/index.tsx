import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import Layout from './Layout'
import * as themes from '../../../themes'
import * as types from '../../../types'

export interface SchemaProps {
  schema?: types.ISchema
  onChange?: (schema: types.ISchema) => void
  onFieldSelected?: (name?: string) => void
}

export default function Schema(props: SchemaProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
