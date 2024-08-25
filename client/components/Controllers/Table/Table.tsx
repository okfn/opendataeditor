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

export default function Table() {
  const theme = useTheme()
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8)})`

  return (
    <React.Fragment>
      <Dialog />
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={store.onTableClickAway}
      >
        <Box sx={{ height: '100%', width: '100%' }}>
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
