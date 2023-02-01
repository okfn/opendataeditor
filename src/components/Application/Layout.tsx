import * as React from 'react'
import Columns from '../Parts/Columns'
import Browser from './Browser'
import Content from './Content'
import Header from './Header'
import Welcome from './Welcome'
import { useStore } from './store'

export default function Layout() {
  const init = useStore((state) => state.init)
  return (
    <React.Fragment>
      <Header />
      {!init ? (
        <Columns layout={[3, 9]}>
          <Browser />
          <Content />
        </Columns>
      ) : (
        <Welcome />
      )}
    </React.Fragment>
  )
}
