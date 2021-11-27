import * as React from 'react'
import findIndex from 'lodash/findIndex'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useStore } from './store'

export default function Menu() {
  const contentType = useStore((state) => state.contentType)
  const setContentType = useStore((state) => state.setContentType)
  const resource = useStore((state) => state.resource)
  const currentIndex = findIndex(steps, { contentType })

  const handleStep = (index: number) => () => {
    const step = steps[index]
    setContentType(step.contentType)
  }

  return (
    <Box sx={{ ml: 2, mt: 2 }}>
      <Stepper nonLinear activeStep={currentIndex} orientation="vertical">
        {steps.map((step, index) => (
          <Step disabled={!resource} key={step.label}>
            <StepButton
              color="inherit"
              icon={step.label[0].toUpperCase()}
              onClick={handleStep(index)}
            >
              {step.label}
            </StepButton>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    disabled={index === steps.length - 1}
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

const steps = [
  {
    label: 'Describe',
    contentType: 'describe',
    description:
      "You can infer, edit and save metadata of your data tables. It's a first step for ensuring data quality and usability. You can use this mode in isolation just e.g. uploading a file, editing a schema, and exporting it. Another option is to commit changes globally to be used in extract, validate, and transform modes.",
  },
  {
    label: 'Extract',
    contentType: 'extract',
    description:
      'You can read your data using a unified tabular interface. Data quality and consistency are guaranteed by a schema.',
  },
  {
    label: 'Validate',
    contentType: 'validate',
    description:
      'You can validate data tables, resources, and datasets. Frictionless generates a unified validation report.',
  },
  {
    label: 'Transform',
    contentType: 'transform',
    description:
      'You can clean, reshape, and transfer your data tables and datasets. Frictionless provides a pipeline capability.',
  },
]
