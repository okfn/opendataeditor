import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import { useTheme } from '@mui/material/styles'
import Action from './Action'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'
import * as store from '@client/store'

export default function Table() {
  const theme = useTheme()
  const panel = store.useStore((state) => state.panel)

  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 42 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8 + panelHeight)})`

  return (
    <Box sx={{ height }}>
      <Menu />
      <ScrollBox height={contentHeight}>
        <Editor />
      </ScrollBox>
      <Panel />
      <Action />
    </Box>
  )
}
