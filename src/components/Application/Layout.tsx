import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Columns from '../Library/Columns'
import Box from '@mui/material/Box'
import Status from '../Status'
import Project from '../Project'
import Content from '../Content'
import { useStore } from './store'

// TODO: merge with app?
// TODO: add transition animation

export default function Layout() {
  const theme = useTheme()
  const path = useStore((state) => state.path)
  const session = useStore((state) => state.session)
  const selectPath = useStore((state) => state.selectPath)
  const ensureProject = useStore((state) => state.ensureProject)
  const headerHeight = theme.spacing(8)
  const contentHeight = `calc(100vh - ${headerHeight} - 1px)`
  React.useEffect(() => {
    ensureProject().catch(console.error)
  }, [])
  if (!session) return null
  return (
    <React.Fragment>
      <Box sx={{ height: headerHeight }}>
        <Status />
      </Box>
      <Box sx={{ height: contentHeight, overflowY: 'hidden' }}>
        <Columns layout={[3, 9]}>
          <Box sx={{ height: contentHeight, borderRight: 'solid 1px #ddd' }}>
            <Project session={session} onPathChange={selectPath} />
          </Box>
          <Box sx={{ height: contentHeight }}>
            {path && <Content session={session} path={path} />}
          </Box>
        </Columns>
      </Box>
    </React.Fragment>
  )
}
