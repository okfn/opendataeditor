import * as React from 'react'
import { IDialect } from '../../../interfaces'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface DialectProps {
  format?: string
  dialect?: IDialect
  onChange?: (dialect: IDialect) => void
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
