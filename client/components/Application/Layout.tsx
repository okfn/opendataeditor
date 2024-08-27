import * as React from 'react'
import Box from '@mui/material/Box'
import Sidebar from './Sidebar'
import Content from './Content'
import Dialog from './Dialog'
import Error from './Error'
import * as store from '@client/store'

export default function Layout() {
  React.useEffect(() => {
    store.onAppStart().catch(console.error)
  }, [])

  return (
    <React.Fragment>
      <Error />
      <Dialog />
      <Box sx={{ display: 'grid', gridTemplateColumns: '284px 1fr', height: '100vh' }}>
        <Sidebar />
        <Content />
      </Box>
    </React.Fragment>
  )
}
