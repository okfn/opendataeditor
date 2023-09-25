import Box from '@mui/material/Box'
import WaitDialog from '../../Parts/Dialogs/Wait'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

export default function StartDialog() {
  return (
    <WaitDialog open={true} title="Open Data Editor" maxWidth="xl">
      <Box>
        <big>
          Initializing the <strong>application</strong>!
        </big>{' '}
        <RocketLaunchIcon sx={{ fontSize: 24 }} />
        If it is a first run on your computer, it may take <strong>
          a few minutes
        </strong>{' '}
        to download dependencies. Next time it will be instant!
      </Box>
    </WaitDialog>
  )
}
