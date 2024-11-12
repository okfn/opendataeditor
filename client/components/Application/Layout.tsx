import * as React from 'react'
import Box from '@mui/material/Box'
import Sidebar from './Sidebar'
import Content from './Content'
import Dialog from './Dialog'
import Error from './Error'
import * as store from '@client/store'

export const fileMenuWidth = 284

export default function Layout() {
  React.useEffect(() => {
    store.onAppStart().catch(console.error)
  }, [])

  return (
    <React.Fragment>
      <Error />
      <Dialog />
      <Box sx={{ display: 'grid', gridTemplateColumns: `${fileMenuWidth}px 1fr` }}>
        <Sidebar />
        <Content />
      </Box>
    </React.Fragment>
  )
}
