import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import { useTheme } from '@mui/material/styles'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'

export default function Table() {
  const theme = useTheme()
  const contentHeight = `calc(100vh - ${theme.spacing(8)})`

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Menu />
      <ScrollBox height={contentHeight}>
        <Editor />
      </ScrollBox>
      <Panel />
    </Box>
  )
}
