import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import * as types from '../../../types'
import Layout from './Layout'

export interface ResourceProps {
  resource?: types.IResource
  externalMenu?: { section: string }
  onChange?: (resource: types.IResource) => void
  onBackClick?: () => void
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
