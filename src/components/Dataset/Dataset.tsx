import * as React from 'react'
import { Provider, makeStore } from './store'
import { Client } from '../../client'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout from './Layout'

export interface DatasetProps {
  client: Client
  path: string
}

export default function Dataset(props: DatasetProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        <Layout />
      </Provider>
    </ThemeProvider>
  )
}
