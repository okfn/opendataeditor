import * as React from 'react'
import Columns from '../Parts/Columns'
import Browser from './Browser'
import Content from './Content'
import Header from './Header'
import Welcome from './Welcome'
import { useStore } from './store'

export default function Layout() {
  const isWelcome = useStore((state) => state.isWelcome)
  return (
    <React.Fragment>
      <Header />
      {isWelcome ? (
        <Welcome />
      ) : (
        <Columns layout={[3, 9]}>
          <Browser />
          <Content />
        </Columns>
      )}
    </React.Fragment>
  )
}
