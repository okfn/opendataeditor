import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import * as store from '@client/store'
import * as React from 'react'

export default function OpenLocationDialog() {
  const handleClose = () => {
    store.closeDialog()
  }

  const [checked, setChecked] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    store.setHideOpenLocationDialog(event.target.checked)
  }

  return (
    <Dialog
      fullWidth
      open={true}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Box>Open Location Dialog</Box>
        <Box
          sx={{
            '& h1': {
              fontSize: '20px',
              fontWeight: '600',
              textAlign: 'center',
            },
            '& div': {
              fontSize: '14px',
              fontWeight: '400',
              textAlign: 'center',
              color: (theme) => theme.palette.OKFNGray500.main,
            },
          }}
        >
          <h1>How the ODE handles your imported files</h1>
          <div>
            The tool makes a copy of your selections into the ODE folder on your Computer.
            Any changes will be made to these copies, while the original data remains
            unchanged.
          </div>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '68px' }}>
          <Box
            sx={{
              '& span': {
                fontSize: '14px',
              },
              color: (theme) => theme.palette.OKFNCoolGray400.main,
            }}
          >
            <Checkbox
              sx={{
                color: '#4C5564',
                '&.Mui-checked': {
                  color: '#4C5564',
                },
              }}
              checked={checked}
              onChange={handleChange}
            />{' '}
            <span>Don't show next time</span>
          </Box>
          <Box>
            <Button variant="contained" sx={{ textTransform: 'none' }}>
              Open File Location
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: 'none', marginLeft: '12px' }}
              onClick={() => store.closeDialog()}
            >
              Okay
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
