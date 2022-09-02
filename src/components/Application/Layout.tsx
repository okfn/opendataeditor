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
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const isFooterOpen = isMetadataOpen
  const footerHeight = isFooterOpen ? theme.spacing(56 + 8 + 2) : theme.spacing(8)
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
