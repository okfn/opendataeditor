import * as React from 'react'
import Tabs from '../Library/Tabs'
import { StoreProvider, createStore } from './store'

function Tab1(props: { name?: string }) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return <StoreProvider value={store}>Tab1</StoreProvider>
}

function Tab2(props: { name?: string }) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return <StoreProvider value={store}>Tab2</StoreProvider>
}

interface TestProps {}

export default function Stores(_props: TestProps) {
  return <Layout />
}

function Layout() {
  return (
    <Tabs labels={['Tab1', 'Tab2']}>
      <Tab1 name="tab1" />
      <Tab2 name="tab2" />
    </Tabs>
  )
}
