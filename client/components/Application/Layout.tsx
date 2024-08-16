import * as React from 'react'
import Columns from '../Parts/Grids/Columns'
import Sidebar from './Sidebar'
import Content from './Content'
import Dialog from './Dialog'
import Error from './Error'
import * as store from '@client/store'

export default function Layout() {
  React.useEffect(() => {
    store.onAppStart().catch(console.error)
  }, [])

  store.openDialog('welcomeBanner')

  return (
    <React.Fragment>
      <Error />
      <Dialog />
      <Columns layout={[3, 9]}>
        <Sidebar />
        <Content />
      </Columns>
    </React.Fragment>
  )
}
