import Box from '@mui/material/Box'
import Browser from './Browser'
import LowerMenu from './LowerMenu'
import sidebarLogo from '../../assets/ODE_sidebar_logo.svg'
import Button from '@mui/material/Button'
import * as store from '@client/store'
import { t } from 'i18next'

export default function Sidebar() {
  return (
    <Box
      className="sidebar"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRight: 'solid 1px #ddd',
      }}
    >
      <Box sx={{ padding: '24px' }}>
        {' '}
        <img src={sidebarLogo} alt="" />
      </Box>
      <Button
        variant="outlined"
        sx={{
          textTransform: 'none',
          marginBottom: '22px',
          mx: '24px',
          '&:hover': {
            color: 'white',
            borderColor: (theme) => theme.palette.OKFNBlue.main,
            backgroundColor: (theme) => theme.palette.OKFNBlue.main,
          },
        }}
        onClick={() => store.openDialog('fileUpload')}
      >
        {t('upload-your-data')}
      </Button>
      <Browser />
      <LowerMenu />
    </Box>
  )
}
