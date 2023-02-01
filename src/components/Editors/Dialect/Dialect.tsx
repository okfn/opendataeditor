import * as React from 'react'
import { IDialect } from '../../../interfaces'
import { StoreProvider, createStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface DialectProps {
  dialect?: IDialect
  onCommit?: (dialect: IDialect) => void
  onRevert?: (dialect: IDialect) => void
}

export default function Dialect(props: DialectProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
