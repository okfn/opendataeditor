import * as React from 'react'
import Box from '@mui/material/Box'
import Content from './Content'
import Header from './Header'
import Footer from './Footer'
import { useStore } from './store'

// TODO: merge with app?
// TODO: add transition animation
// TODO: rebase pixel values by theme.spacing(8)

export default function Layout() {
  const contentType = useStore((state) => state.contentType)
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const footerHeight = contentType === 'data' && isMetadataOpen ? '544px' : '64px'
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
