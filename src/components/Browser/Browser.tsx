import * as React from 'react'
import { Provider, makeStore } from './store'
import { Client } from '../../client'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout from './Layout'

export interface BrowserProps {
  client: Client
  path?: string
}

export default function Browser(props: BrowserProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        <Layout path={props.path} />
      </Provider>
    </ThemeProvider>
  )
}
