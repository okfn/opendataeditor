import * as React from 'react'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CheckCircle from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LightTooltip from '../Tooltips/Light'

// TODO: create BaseChip / move concrete to appliction?

export interface ValidationChipProps {
  errorCount?: number
}

export default function ValidationChip(props: ValidationChipProps) {
  let title = 'Select a file in the browser to validate'
  if (props.errorCount !== undefined) title = 'There is no validation errors'
  if (props.errorCount) title = 'There are validation errors'
  return (
    <LightTooltip title={title}>
      <Chip
        label={props.errorCount ? 'ERROR' : 'VALID'}
        color={
          props.errorCount ? 'error' : props.errorCount !== undefined ? 'success' : 'info'
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
          width: '8vw',
          height: '100%',
          borderLeft: 'solid 1px #ddd',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      />
    </LightTooltip>
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
