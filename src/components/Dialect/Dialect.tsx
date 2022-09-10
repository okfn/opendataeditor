import * as React from 'react'
import { IDialect } from '../../interfaces'
import { Provider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface DialectProps {
  dialect?: IDialect
  onCommit?: (dialect: IDialect) => void
  onRevert?: (dialect: IDialect) => void
}

export default function Dialect(props: DialectProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        <Layout />
      </Provider>
    </ThemeProvider>
  )
}
