import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = 48
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + panelHeight)})`
  const loadFields = useStore((state) => state.loadFields)
  const path = useStore((state) => state.file?.path)
  React.useEffect(() => {
    loadFields().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Menu />
        <Box sx={{ height: contentHeight }}>
          <Editor />
        </Box>
        <Panel />
        <Actions />
      </Box>
    </React.Fragment>
  )
}
