import * as React from 'react'
import { StoreProvider, createStore } from './store'
import Layout from './Layout'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { Client } from '../../../client'
import { ConfirmProvider } from 'material-ui-confirm'

export interface FilesProps {
  client: Client
  initialUpload?: boolean
  initialDataPackage?: boolean
  onFileChange: (path?: string) => void
}

export default function Files(props: FilesProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <ConfirmProvider>
          <Layout />
        </ConfirmProvider>
      </StoreProvider>
    </ThemeProvider>
  )
}
