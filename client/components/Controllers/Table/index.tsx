import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import { useTheme } from '@mui/material/styles'
import Action from './Action'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'

export default function Table() {
  const theme = useTheme()
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8)})`

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Menu />
      <ScrollBox height={contentHeight}>
        <Editor />
      </ScrollBox>
      <Panel />
      <Action />
    </Box>
  )
}
