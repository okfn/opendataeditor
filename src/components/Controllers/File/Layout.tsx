import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../Parts/ScrollBox'
import Actions from './Actions'
import Editor from './Editor'
import Dialog from './Dialog'
import Menu from './Menu'
import Panel from './Panel'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + panelHeight)})`
  const file = useStore((state) => state.file)
  const load = useStore((state) => state.load)
  React.useEffect(() => {
    load().catch(console.error)
  }, [file])
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Menu />
        <ScrollBox height={contentHeight}>
          <Editor />
        </ScrollBox>
        <Panel />
        <Actions />
      </Box>
    </React.Fragment>
  )
}
