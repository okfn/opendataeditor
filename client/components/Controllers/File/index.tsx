import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/Boxes/Scroll'
import Menu from './Menu'
import Panel from './Panel'
import View from './View'

export default function File() {
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
        <View />
      </ScrollBox>
      <Panel />
    </Box>
  )
}
