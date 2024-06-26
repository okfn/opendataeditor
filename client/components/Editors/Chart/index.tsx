import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import * as types from '../../../types'
import Layout from './Layout'

export interface ChartProps {
  chart?: types.IChart
  columns?: types.IColumn[]
  onChange?: (chart: types.IChart) => void
}

export default function Chart(props: ChartProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Layout />
    </StoreProvider>
  )
}
