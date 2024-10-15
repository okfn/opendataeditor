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
      <ScrollBox sx={{ flexGrow: 1, zIndex: 10 }}>
        <Editor />
      </ScrollBox>
      <Panel />
    </Box>
  )
}
