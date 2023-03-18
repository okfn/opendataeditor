import * as React from 'react'
import { IPackage } from '../../../interfaces'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface PackageProps {
  package?: IPackage
  onChange?: (pkg: IPackage) => void
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
