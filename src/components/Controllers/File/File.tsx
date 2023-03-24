import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { Client } from '../../../client'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { IFile } from '../../../interfaces'
import Layout from './Layout'

export interface FileProps {
  client: Client
  file: IFile
}

export default function File(props: FileProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
