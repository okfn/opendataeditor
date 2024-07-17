import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import SimpleButton from '../../Parts/Buttons/SimpleButton'
import Checkbox from '@mui/material/Checkbox'
import * as store from '@client/store'
import * as React from 'react'
import welcomescreenImg from './assets/welcomescreen.png'

export default function WelcomeBanner() {
  const [checked, setChecked] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    // TODO: how to save value directly to the store, do i have access to the store
    // or do i need to write an action?
    // store.setState({'hideWelcomeBanner', checked})
    // or do we use config.json as suggested by @pdelboca
  }

  return (
    <Dialog open={true}>
      <DialogContent
        sx={{
          paddingTop: '56px',
          paddingLeft: '52px',
          fontFamily: "'Hanken Grotesk Variable', sans-serif",
        }}
      >
        <Box>
          <img src={welcomescreenImg} alt="Welcome Screen" />
        </Box>
        <Box
          sx={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1D1916',
            paddingTop: '32px',
            paddingBottom: '20px',
          }}
        >
          <div>Welcome to the Open Data Editor!</div>
        </Box>
        <Box
          sx={{
            fontSize: '18px',
            color: '#6B7380',
            fontWeight: '400',
            whiteSpace: 'pre-wrap',
          }}
        >
          <div>
            The ODE helps data practitioners with no coding skills to explore tabular data
            and detect errors in an easier way. Advanced users can also edit metadata and
            publish their work.
            <br />
            <br />
            The OKFN team aims to add other data formats in the future.
            <b> Check our blog for updates</b>
          </div>
        </Box>
        <Box
          sx={{
            backgroundColor: '#00D1FF',
            marginTop: '48px',
          }}
        >
          <SimpleButton
            fullWidth
            label={'Get started'}
            sx={{ my: 0.5 }}
            onClick={store.closeDialog}
            aria-label="accept"
          />
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#9CA2AE',
            marginTop: '24px',
          }}
        >
          <Checkbox checked={checked} onChange={handleChange} /> Don't show this screen on
          the next launch
        </Box>
      </DialogContent>
    </Dialog>
  )
}
