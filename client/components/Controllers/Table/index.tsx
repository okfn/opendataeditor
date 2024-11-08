import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'

export default function Table() {
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
      <Box sx={{ flexGrow: 1, display: 'flex', zIndex: 10 }}>
        <ScrollBox sx={{ flexGrow: 1 }}>
          <Editor />
        </ScrollBox>
        <Panel />
      </Box>
    </Box>
  )
}
