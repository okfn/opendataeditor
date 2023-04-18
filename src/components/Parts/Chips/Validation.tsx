import * as React from 'react'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CheckCircle from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

export interface ValidationChipProps {
  errorCount?: number
}

export default function ValidationChip(props: ValidationChipProps) {
  let title = 'Select a file to validate'
  if (props.errorCount !== undefined) title = 'There is no validation errors'
  if (props.errorCount) title = 'There are validation errors'
  return (
    <Chip
      title={title}
      label={props.errorCount ? 'ERRORS' : 'VALID'}
      color={
        props.errorCount
          ? 'error'
          : props.errorCount !== undefined
          ? 'success'
          : 'primary'
      }
      icon={
        props.errorCount ? (
          <NumberIcon value={props.errorCount ?? 0} />
        ) : props.errorCount !== undefined ? (
          <CheckCircle />
        ) : (
          <HelpOutlineIcon />
        )
      }
      size="medium"
      sx={{
        height: '100%',
        borderLeft: 'solid 1px #ddd',
        borderRadius: '3px',
      }}
    />
  )
}

const NumberIcon = (props: { value: number }) => (
  <Typography
    sx={{
      color: '#ed6c02',
      paddingX: '5px',
      height: '1rem',
      bgcolor: '#fff',
      ml: '10px',
      fontSize: 'inherit',
      borderRadius: '400px',
    }}
  >
    {props.value}
  </Typography>
)
