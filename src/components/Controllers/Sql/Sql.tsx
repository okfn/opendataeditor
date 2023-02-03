import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StoreProvider, createStore } from './store'
import * as themes from '../../../themes'
import { Client } from '../../../client'
import { IRecord } from '../../../interfaces'
import Layout from './Layout'

export interface SqlProps {
  client: Client
  record: IRecord
}

export default function Sql(props: SqlProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
