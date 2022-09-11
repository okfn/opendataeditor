import * as React from 'react'
import { ISchema } from '../../interfaces'
import { StoreProvider, createStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface SchemaProps {
  schema?: ISchema
  onCommit?: (schema: ISchema) => void
  onRevert?: (schema: ISchema) => void
}

export default function Schema(props: SchemaProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
