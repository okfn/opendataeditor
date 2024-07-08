import * as React from 'react'
import { ClickAwayListener } from '@mui/base'
import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import { useTheme } from '@mui/material/styles'
import Action from './Action'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'
import Dialog from './Dialog'
import * as store from '@client/store'

export default function Layout() {
  const theme = useTheme()
  const panel = store.useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 42 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8 + panelHeight)})`

  return (
    <React.Fragment>
      <Dialog />
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={store.catchTableClickAway}
      >
        <Box sx={{ height }}>
          <Menu />
          <ScrollBox height={contentHeight}>
            <Editor />
          </ScrollBox>
          <Panel />
          <Action />
        </Box>
      </ClickAwayListener>
    </React.Fragment>
  )
}
