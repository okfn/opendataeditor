import * as React from 'react'
import { StoreProvider, createStore, useStore } from './store'

export interface TestProps {
  name1?: string
  name2?: string
}

export default function Stores(props: TestProps) {
  return (
    <div>
      <Level2 name={props.name1} />
      <Level2 name={props.name2} />
    </div>
  )
}

function Level2(props: { name?: string }) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <StoreProvider value={store}>
      <Level3 />
    </StoreProvider>
  )
}

function Level3() {
  const name = useStore((state) => state.name)
  return <div>{name}</div>
}
