import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StoreProvider, makeStore } from './store'
import * as themes from '../../../themes'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import Layout from './Layout'

export interface ChartProps {
  file: IFile
  client: Client
}

export default function Chart(props: ChartProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
