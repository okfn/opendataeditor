import * as React from 'react'
import Content from './Content'
import Header from './Header'

export default function Layout() {
  return (
    <React.Fragment>
      <Header />
      <Content />
    </React.Fragment>
  )
}
