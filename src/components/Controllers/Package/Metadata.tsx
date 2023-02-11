import * as React from 'react'
import { StoreProvider, createStore } from './store'
import { Client } from '../../../client'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { IFile } from '../../../interfaces'
import Layout from './Layout'

export interface MetadataProps {
  client: Client
  file: IFile
  onPathChange?: (path?: string) => void
}

export default function Metadata(props: MetadataProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
