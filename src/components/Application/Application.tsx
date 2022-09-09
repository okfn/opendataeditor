import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Provider, makeStore } from './store'
import CssBaseline from '@mui/material/CssBaseline'
import { Client } from '../../client'
import * as themes from '../../themes'
import Layout from './Layout'

export interface ApplicationProps {
  client?: Client
}

export default function Application(props: ApplicationProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        <CssBaseline />
        <Layout />
      </Provider>
    </ThemeProvider>
  )
}
