import * as React from 'react'
import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/ScrollBox'
import Actions from './Actions'
import Dialog from './Dialog'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8 + panelHeight)})`
  const file = useStore((state) => state.file)
  const modified = useStore((state) => state.modified)
  const load = useStore((state) => state.load)
  React.useEffect(() => {
    load().catch(console.error)
  }, [file])
  if (!modified) return null
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height }}>
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
