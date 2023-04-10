import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'
import { useStore } from './store'
import Dialog from './Dialog'

export default function Layout() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + panelHeight)})`
  const path = useStore((state) => state.file.path)
  const loadTable = useStore((state) => state.loadTable)
  const loadSource = useStore((state) => state.loadSource)
  React.useEffect(() => {
    // TODO: rework
    loadTable().catch(console.error)
    loadSource().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Dialog />
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
