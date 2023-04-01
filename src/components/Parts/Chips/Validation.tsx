import * as React from 'react'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CheckCircle from '@mui/icons-material/CheckCircle'

export interface ValidationChipProps {
  errorCount: number
}

export default function ValidationChip(props: ValidationChipProps) {
  return (
    <Chip
      label={props.errorCount ? 'errors' : 'valid'}
      color={props.errorCount ? 'error' : 'success'}
      icon={
        props.errorCount ? <NumberIcon value={props.errorCount ?? 0} /> : <CheckCircle />
      }
      size="medium"
      sx={{ height: '100%', ml: 1, borderLeft: 'solid 1px #ddd', borderRadius: '3px' }}
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
