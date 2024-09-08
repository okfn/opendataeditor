import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import * as store from '@client/store'
import * as React from 'react'
import MobileStepper from '@mui/material/MobileStepper'
import openFileLocationDialogSlide1 from './assets/open_file_dialog_slide1.png'
import openFileLocationDialogSlide2 from './assets/open_file_dialog_slide2.png'
import openFileLocationDialogSlide3 from './assets/open_file_dialog_slide3.png'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'

export default function OpenLocationDialog() {
  const handleClose = () => {
    store.closeDialog()
  }

  const [checked, setChecked] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    store.setHideOpenLocationDialog(event.target.checked)
  }

  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const openFileLocationDialogSlides = [
    openFileLocationDialogSlide1,
    openFileLocationDialogSlide2,
    openFileLocationDialogSlide3,
  ]

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

      <DialogContent
        sx={{
          padding: 0,
          margin: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <img
            width="100%"
            src={openFileLocationDialogSlides[activeStep]}
            alt={`Open File Location Slide ${activeStep}`}
          />
          <MobileStepper
            variant="dots"
            steps={3}
            position="static"
            activeStep={activeStep}
            sx={{
              maxWidth: 400,
              width: 250,
              flexGrow: 1,
              '& .MuiMobileStepper-dots .MuiMobileStepper-dotActive': {
                backgroundColor: (theme) => theme.palette.OKFNBlue.main,
              },
            }}
            nextButton={
              <Button
                color="OKFNBlue"
                size="small"
                onClick={handleNext}
                disabled={activeStep === 2}
              >
                Next
                {<KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button
                color="OKFNBlue"
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {<KeyboardArrowLeft />}
                Back
              </Button>
            }
          />
        </Box>
        <Box sx={{ padding: '20px 24px' }}>
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
              The tool makes a copy of your selections into the ODE folder on your
              Computer. Any changes will be made to these copies, while the original data
              remains unchanged.
            </div>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '68px' }}
          >
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
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  color: 'black',
                  borderColor: 'black',
                  '&:hover': {
                    borderColor: (theme) => theme.palette.OKFNCoolGray.main,
                    color: (theme) => theme.palette.OKFNCoolGray.main,
                  },
                }}
              >
                Open File Location
              </Button>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  marginLeft: '12px',
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.OKFNCoolGray.main,
                    color: 'white',
                  },
                }}
                onClick={() => store.closeDialog()}
              >
                Okay
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
