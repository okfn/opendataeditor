import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import Action from './Action'
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
  const load = useStore((state) => state.load)
  const path = useStore((state) => state.path)
  React.useEffect(() => {
    load().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Menu />
        <ScrollBox height={contentHeight}>
          <Editor />
        </ScrollBox>
        <Panel />
        <Action />
      </Box>
    </React.Fragment>
  )
}
