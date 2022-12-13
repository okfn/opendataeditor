import * as React from 'react'
import { StoreProvider, createStore } from './store'
import Layout from './Layout'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { Client } from '../../../client'

export interface FilesProps {
  client: Client
  onPathChange: (path?: string) => void
  listFolders?: () => Promise<string[]>
}

export default function Files(props: FilesProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
