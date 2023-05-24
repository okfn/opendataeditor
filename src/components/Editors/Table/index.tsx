import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import { IReport, IError, IRow } from '../../../interfaces'
import { ISchema, ITableLoader } from '../../../interfaces'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface TableProps {
  // Currently used only to rerender
  mode?: 'errors'
  height?: string
  source: IRow[] | ITableLoader
  schema: ISchema
  report?: IReport
  readOnly?: boolean
  onCellUpdate?: (rowNumber: number, fieldName: string, value: any) => void
  onRowDelete?: (rowNumber: number) => void
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
