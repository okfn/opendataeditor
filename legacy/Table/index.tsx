import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import { IReport, IError, IRow } from '../../../interfaces'
import { ISchema, ITableLoader, ITablePatch, ITableChange } from '../../../interfaces'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface TableProps {
  // Currently used only to rerender
  mode?: 'errors'
  height?: string
  source: IRow[] | ITableLoader
  schema: ISchema
  report?: IReport
  patch?: ITablePatch
  readOnly?: boolean
  onChange?: (change: ITableChange) => void
  onErrorClick?: (error: IError) => void
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
