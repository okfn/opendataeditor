import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import { IReport, IError, IRow } from '../../../interfaces'
import { ISchema, ITableLoader, ITablePatch } from '../../../interfaces'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface TableProps {
  source: IRow[] | ITableLoader
  schema: ISchema
  report?: IReport
  patch?: ITablePatch
  readOnly?: boolean
  height?: string
  onErrorClick?: (error: IError) => void
  // Currently used only to rerender
  mode?: 'errors'
}

export default function Table(props: TableProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
