import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Columns from '../Library/Columns'
import Box from '@mui/material/Box'
import Data from './Data'
import Header from './Header'
import Resource from '../Resource'
import Project from '../Project'
import { useStore } from './store'

// TODO: merge with app?
// TODO: add transition animation

export default function Layout() {
  const theme = useTheme()
  const session = useStore((state) => state.session)
  const resource = useStore((state) => state.resource)
  const selectPath = useStore((state) => state.selectPath)
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const footerHeight = isMetadataOpen ? theme.spacing(56 + 2) : theme.spacing(0)
  const contentHeight = `calc(100vh - ${theme.spacing(8)} - ${footerHeight} - 1px)`
  const projectHeight = `calc(100vh - ${theme.spacing(8)} - 1px)`
  const headerHeight = theme.spacing(8)
  return (
    <React.Fragment>
      <Box sx={{ height: headerHeight }}>
        <Header />
      </Box>
      <Box sx={{ height: contentHeight, overflowY: 'hidden' }}>
        <Columns layout={[3, 9]}>
          <Box sx={{ height: projectHeight }}>
            <Project session={session} onPathChange={selectPath} />
          </Box>
          <Box sx={{ height: projectHeight }}>
            <Box sx={{ height: contentHeight }}>
              <Data />
            </Box>
            {isMetadataOpen ? (
              <Box sx={{ height: footerHeight }}>
                <Box sx={{ borderTop: 'solid 1px #ddd' }}>
                  <Resource withTabs={true} descriptor={resource} />
                </Box>
              </Box>
            ) : null}
          </Box>
        </Columns>
      </Box>
    </React.Fragment>
  )
}
