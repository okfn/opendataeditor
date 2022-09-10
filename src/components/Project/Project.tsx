import * as React from 'react'
import { Provider, makeStore } from './store'
import Layout from './Layout'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import { Client } from '../../client'

export interface ProjectProps {
  client: Client
  onPathChange: (path?: string) => void
}

export default function Schema(props: ProjectProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        <Layout />
      </Provider>
    </ThemeProvider>
  )
}
