import * as React from 'react'
import findIndex from 'lodash/findIndex'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import * as settings from '../settings'

interface MenuProps {
  state: any
  dispatch: any
}

export default function Menu(props: MenuProps) {
  const { page } = props.state
  const currentIndex = findIndex(settings.STEPS, { page })

  const handleStep = (index: number) => () => {
    const step = settings.STEPS[index]
    props.dispatch({ type: 'SET_PAGE', page: step.page })
  }

  return (
    <Box sx={{ ml: 2, mt: 2 }}>
      <Stepper nonLinear activeStep={currentIndex} orientation="vertical">
        {settings.STEPS.map((step, index) => (
          <Step key={step.label}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {step.label}
            </StepButton>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    disabled={index === settings.STEPS.length - 1}
                    variant="contained"
                    onClick={handleStep(index + 1)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Next
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleStep(index - 1)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
