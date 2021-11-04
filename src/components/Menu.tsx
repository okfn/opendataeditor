import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const steps = [
  {
    label: 'Describe',
    description:
      "You can infer, edit and save metadata of your data tables. It's a first step for ensuring data quality and usability.",
  },
  {
    label: 'Extract',
    description:
      'You can read your data using a unified tabular interface. Data quality and consistency are guaranteed by a schema.',
  },
  {
    label: 'Validate',
    description:
      'You can validate data tables, resources, and datasets. Frictionless generates a unified validation report.',
  },
  {
    label: 'Transform',
    description:
      'You can clean, reshape, and transfer your data tables and datasets. Frictionless provides a pipeline capability.',
  },
]

export default function Menu() {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  return (
    <Box sx={{ ml: 2 }}>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {step.label}
            </StepButton>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    disabled={index === steps.length - 1}
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Next
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
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
