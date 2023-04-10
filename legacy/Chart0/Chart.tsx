import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { IChart, IFieldItem } from '../../../interfaces'
import Layout from './Layout'

export interface ChartProps {
  chart?: IChart
  fields?: IFieldItem[]
  onChartChange?: (chart: IChart) => void
}

export default function Chart(props: ChartProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
