import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { IView, IFieldItem, IViewError } from '../../../interfaces'
import Layout from './Layout'

export interface ViewProps {
  view?: IView
  fields?: IFieldItem[]
  viewError?: IViewError
  onViewChange?: (view: IView) => void
  onQueryValidation?: (queryValidationStatus: boolean) => void
}

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
