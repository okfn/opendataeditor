import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../Parts/Boxes/Scroll'
import Action from './Action'
import Dialog from './Dialog'
import Menu from './Menu'
import Panel from './Panel'
import Viewer from './Viewer'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8 + panelHeight)})`
  const load = useStore((state) => state.load)
  const path = useStore((state) => state.path)
  React.useEffect(() => {
    load().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height }}>
        <Menu />
        <ScrollBox height={contentHeight}>
          <Viewer />
        </ScrollBox>
        <Panel />
        <Action />
      </Box>
    </React.Fragment>
  )
}
