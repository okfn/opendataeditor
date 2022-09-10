import * as React from 'react'
import { ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
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
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        <Layout />
      </Provider>
    </ThemeProvider>
  )
}
