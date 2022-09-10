import * as React from 'react'
import { useStore } from 'zustand'
import { StoreProvider, createStore, getStore } from './store'

export interface TestProps {
  name1?: string
  name2?: string
}

export default function Test(props: TestProps) {
  return (
    <div>
      <Level2 name={props.name1} />
      <Level2 name={props.name2} />
    </div>
  )
}

function Level2(props: { name?: string }) {
  const store = React.useMemo(() => createStore(props), [props.name])
  return (
    <StoreProvider value={store}>
      <Level3 />
    </StoreProvider>
  )
}

function Level3() {
  const store = getStore()
  const name = useStore(store, (state) => state.name)
  return <div>{name}</div>
}
