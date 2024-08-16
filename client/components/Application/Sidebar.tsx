import Box from '@mui/material/Box'
import Browser from './Browser'
import LowerMenu from './LowerMenu'
import { useTheme } from '@mui/material/styles'
import sidebarLogo from '../../assets/ODE_sidebar_logo.svg'

export default function Sidebar() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8)})`

  return (
    <Box sx={{ height, borderRight: 'solid 1px #ddd', width: '284px', padding: '24px' }}>
      <img src={sidebarLogo} alt="" />
      <Box sx={{ height: contentHeight }}>
        <Browser />
      </Box>
      <LowerMenu />
    </Box>
  )
}
