import * as React from 'react'
import { IResource } from '../../../interfaces'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface ResourceProps {
  resource?: IResource
  onChange?: (resource: IResource) => void
  onFieldSelected?: (name?: string) => void
}

export default function Resource(props: ResourceProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
