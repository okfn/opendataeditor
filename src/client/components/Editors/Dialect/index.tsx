import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import * as types from '../../../types'
import Layout from './Layout'

export interface DialectProps {
  type?: string
  format?: string
  dialect?: types.IDialect
  externalMenu?: { section: string }
  onChange?: (dialect: types.IDialect) => void
}

export default function Dialect(props: DialectProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
