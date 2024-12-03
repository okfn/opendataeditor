import openFileLocationDialogSlide1 from '@client/assets/open_file_dialog_slide1.png'
import openFileLocationDialogSlide2 from '@client/assets/open_file_dialog_slide2.png'
import openFileLocationDialogSlide3 from '@client/assets/open_file_dialog_slide3.png'
import * as store from '@client/store'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import MobileStepper from '@mui/material/MobileStepper'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export default function OpenLocationDialog() {
  const handleClose = () => {
    store.closeDialog()
  }

  const hideOpenLocationDialog = store.useStore((state) => state.hideOpenLocationDialog)

  const [checked, setChecked] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    store.setHideOpenLocationDialog(event.target.checked)
  }

  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const { t } = useTranslation()

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
      open={!hideOpenLocationDialog}
      fullWidth
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
            alt={`${t('alt-open-file-location')} ${activeStep}`}
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
                {t('next')}
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
                {t('back')}
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
            <h1>{t('how-ODE-handles-your-files')}</h1>
            <div>{t('openlocationbanner-description')}</div>
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
              <span>{t('openlocation-dont-show-again')}</span>
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
                onClick={() => {
                  // @ts-ignore
                  window?.opendataeditor?.openPathInExplorer('/tmp')
                }}
              >
                {t('open-file-location')}
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
                {t('okay')}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
