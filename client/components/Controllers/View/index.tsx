import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StoreProvider, makeStore } from './store'
import * as themes from '../../../themes'
import { ControllerProps } from '../../Controllers/Base'
import Layout from './Layout'

export interface ViewProps extends ControllerProps {}

export default function View(props: ViewProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
