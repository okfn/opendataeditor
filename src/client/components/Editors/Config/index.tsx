import * as React from 'react'
import * as themes from '../../../themes'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import Layout from './Layout'
import * as types from '../../../types'

export interface ConfigProps {
  config?: types.IConfig
  onChange?: (config: types.IConfig) => void
}

export default function Config(props: ConfigProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
