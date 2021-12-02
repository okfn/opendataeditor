import * as React from 'react'
import Box from '@mui/material/Box'
import Content from './Contents'
import Header from './Header'
import Footer from './Footer'
import { useStore } from './store'

// TODO: add transition animation
// TODO: rebase pixel values by theme.spacing(8)

export default function Layout() {
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const footerHeight = isMetadataOpen ? '464px' : '64px'
  const contentHeight = `calc(100vh - 64px - ${footerHeight})`
  return (
    <React.Fragment>
      <Box sx={{ height: '64px' }}>
        <Header />
      </Box>
      <Box sx={{ height: contentHeight, overflowY: 'auto' }}>
        <Content />
      </Box>
      <Box sx={{ height: footerHeight }}>
        <Footer />
      </Box>
    </React.Fragment>
  )
}
