import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { StoreProvider, makeStore } from './store'
import * as themes from '../../../themes'
import { ResourceControllerProps } from '../../Parts/Controller/Resource'
import Layout from './Layout'

export interface SqlProps extends ResourceControllerProps {}

export default function Sql(props: SqlProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
