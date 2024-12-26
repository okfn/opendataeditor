import * as store from '@client/store'
import Box from '@mui/material/Box'
import * as React from 'react'
import Content from './Content'
import Dialog from './Dialog'
import Error from './Error'
import Sidebar from './Sidebar'

export const fileMenuWidth = 284

export default function Layout() {
  React.useEffect(() => {
    store.onAppStart().catch(console.error)
  }, [])

  return (
    <React.Fragment>
      <Error />
      <Dialog />
      <Box
        sx={{
          height: '100vh',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: `${fileMenuWidth}px 1fr`,
        }}
      >
        <Sidebar />
        <Content />
      </Box>
    </React.Fragment>
  )
}
