import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import * as types from '../../../types'
import Layout from './Layout'

export interface PackageProps {
  package?: types.IPackage
  onChange?: (pkg: types.IPackage) => void
  onAddResource?: () => void
  onFieldSelected?: (name?: string) => void
}

export default function Package(props: PackageProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
