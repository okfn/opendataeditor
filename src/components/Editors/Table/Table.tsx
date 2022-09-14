import * as React from 'react'
import { StoreProvider, createStore } from './store'
import { Client } from '../../client'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout from './Layout'

export interface TableProps {
  client: Client
  path: string
}

export default function Table(props: TableProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
