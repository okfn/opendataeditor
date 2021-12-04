import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Content from './Content'
import Header from './Header'
import Footer from './Footer'
import { useStore } from './store'

// TODO: merge with app?
// TODO: add transition animation

export default function Layout() {
  const theme = useTheme()
  const contentType = useStore((state) => state.contentType)
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const isFooterOpen = contentType === 'data' && isMetadataOpen
  const footerHeight = isFooterOpen ? theme.spacing(66) : theme.spacing(8)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight})`
  const headerHeight = theme.spacing(8)
  return (
    <React.Fragment>
      <Box sx={{ height: headerHeight }}>
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
