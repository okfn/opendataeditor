import * as React from 'react'
import { ISchema } from '../../../interfaces'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface SchemaProps {
  schema?: ISchema
  onChange?: (schema: ISchema) => void
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
