import * as React from 'react'
import { IResource } from '../../../interfaces'
import { StoreProvider, createStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface ResourceProps {
  withTabs?: boolean
  resource?: IResource
  onCommit?: (resource: IResource) => void
  onRevert?: (resource: IResource) => void
}

export default function Resource(props: ResourceProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
