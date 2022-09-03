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
  const footerHeight = isMetadataOpen ? theme.spacing(56 + 8 + 2) : theme.spacing(0)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight})`
  const headerHeight = theme.spacing(8)
  return (
    <React.Fragment>
      <Box sx={{ height: headerHeight }}>
        <Header />
      </Box>
      <Columns layout={[3, 9]}>
        <Box>
          <Project />
        </Box>
        <Box>
          <Box sx={{ height: contentHeight, overflowY: 'auto' }}>
            <Data />
          </Box>
          <Box sx={{ height: footerHeight }}>
            {isMetadataOpen ? (
              <Box sx={{ padding: 2, paddingBottom: 0 }}>
                <Metadata />
              </Box>
            ) : null}
          </Box>
        </Box>
      </Columns>
    </React.Fragment>
  )
}
