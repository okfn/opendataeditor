import Box from '@mui/material/Box'
import Editor from './Editor'
import Menu from './Menu'
import Panel from './Panel'

export default function Text() {
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
      <Box sx={{ flexGrow: 1 }}>
        <Editor />
      </Box>
      <Panel />
    </Box>
  )
}
