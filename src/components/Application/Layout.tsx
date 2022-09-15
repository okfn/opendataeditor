import * as React from 'react'
import Columns from '../Views/Library/Columns'
import Browser from './Browser'
import Content from './Content'
import Header from './Header'

export default function Layout() {
  return (
    <React.Fragment>
      <Header />
      <Columns layout={[3, 9]}>
        <Browser />
        <Content />
      </Columns>
    </React.Fragment>
  )
}
