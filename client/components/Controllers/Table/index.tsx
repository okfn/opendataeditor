import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'
import { useTheme } from '@mui/material/styles'

export default function Table() {
  const theme = useTheme()

  const panelHeight = `calc(100vh - ${theme.spacing(8)})`

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Menu />
      <Box sx={{ flexGrow: 1, display: 'flex', zIndex: 10, maxHeight: panelHeight }}>
        <ScrollBox sx={{ flexGrow: 1 }}>
          <Editor />
        </ScrollBox>
        <Panel />
      </Box>
    </Box>
  )
}
