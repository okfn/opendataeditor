import * as React from 'react'
import { ClickAwayListener } from '@mui/base'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Action from './Action'
import Editor from './Editor'
import View from './View'
import Dialog from './Dialog'
import Menu from './Menu'
import Panel from './Panel'
import Columns from '../../Parts/Grids/Columns'
import * as store from '@client/store'

export default function Text() {
  const theme = useTheme()
  const panel = store.useStore((state) => state.panel)
  const type = store.useStore((state) => state.record?.type)

  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 42 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8 + panelHeight)})`
  const withViewer = type === 'article'

  return (
    <React.Fragment>
      <Dialog />
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={store.onTextClickAway}
      >
        <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
          <Menu />
          {withViewer ? (
            <TwoColumns height={contentHeight} />
          ) : (
            <OneColumn height={contentHeight} />
          )}
          <Panel />
          <Action />
        </Box>
      </ClickAwayListener>
    </React.Fragment>
  )
}

function TwoColumns(props: { height: string }) {
  const { height } = props
  return (
    <Columns spacing={2}>
      <OneColumn height={height} />
      <Box sx={{ height, borderLeft: 'solid 1px #ddd' }}>
        <View />
      </Box>
    </Columns>
  )
}

function OneColumn(props: { height: string }) {
  const { height } = props
  return (
    <Box sx={{ height }}>
      <Editor />
    </Box>
  )
}
