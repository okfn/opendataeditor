import * as React from 'react'
import * as themes from '../../../themes'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import Layout from './Layout'
import * as types from '../../../types'

export interface ControlProps {
  control?: types.IControl
  onChange?: (view: types.IControl) => void
}

export default function Control(props: ControlProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
