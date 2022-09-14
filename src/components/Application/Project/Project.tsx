import * as React from 'react'
import { StoreProvider, createStore } from './store'
import Layout from './Layout'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import { Client } from '../../client'

export interface ProjectProps {
  client: Client
  onPathChange: (path?: string) => void
}

export default function Schema(props: ProjectProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
