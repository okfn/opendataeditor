import * as React from 'react'
import Box from '@mui/material/Box'
import Content from './Content'
import Header from './Header'
import Footer from './Footer'

// TODO: rebase pixel values by theme.spacing(8)

export default function Layout() {
  return (
    <React.Fragment>
      <Box sx={{ height: '64px' }}>
        <Header />
      </Box>
      <Box sx={{ height: 'calc(100vh - 64px - 64px)', overflowY: 'auto' }}>
        <Content />
      </Box>
      <Box sx={{ height: '64px' }}>
        <Footer />
      </Box>
    </React.Fragment>
  )
}
