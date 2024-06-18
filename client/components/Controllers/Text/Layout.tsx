import * as React from 'react'
import Error from './Error'
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
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 42 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8 + panelHeight)})`
  const load = useStore((state) => state.load)
  const path = useStore((state) => state.path)
  const type = useStore((state) => state.record?.type)
  const withViewer = type === 'article' || type === 'script'
  const onClickAway = useStore((state) => state.onClickAway)
  React.useEffect(() => {
    load().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Error />
      <Dialog />
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={onClickAway}
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
