import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Columns from '../Library/Columns'
import Box from '@mui/material/Box'
import Data from './Data'
import Header from './Header'
import Metadata from './Metadata'
import Project from './Project'
import { useStore } from './store'

// TODO: merge with app?
// TODO: add transition animation

export default function Layout() {
  const theme = useTheme()
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const footerHeight = isMetadataOpen ? theme.spacing(56 + 2) : theme.spacing(0)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight} - 1px)`
  const headerHeight = theme.spacing(8)
  return (
    <React.Fragment>
      <Box sx={{ height: headerHeight }}>
        <Header />
      </Box>
      <Box sx={{ height: contentHeight, overflowY: 'hidden' }}>
        <Columns layout={[3, 9]}>
          <Project />
          <Data />
        </Columns>
      </Box>
      <Box sx={{ height: footerHeight }}>
        {isMetadataOpen ? (
          <Box sx={{ padding: 2, paddingBottom: 0, borderTop: 'solid 1px #ddd' }}>
            <Metadata />
          </Box>
        ) : null}
      </Box>
    </React.Fragment>
  )
}
