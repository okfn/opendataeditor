import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { Client } from '../../../client'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { IFile } from '../../../interfaces'
import Layout from './Layout'

export interface TableProps {
  client: Client
  file: IFile
  isMetadata?: boolean
  onExport: (path: string) => void
}

export default function Table(props: TableProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
