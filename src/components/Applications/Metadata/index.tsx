import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StoreProvider, makeStore } from './store'
import CssBaseline from '@mui/material/CssBaseline'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface MetadataProps {}

export default function Metadata(props: MetadataProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <CssBaseline />
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
