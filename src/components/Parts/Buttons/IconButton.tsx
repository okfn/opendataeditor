import * as React from 'react'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'

interface IconButtonProps extends ButtonProps {
  Icon: React.ElementType
  label?: string
  small?: boolean
}

export default function IconButton(props: IconButtonProps) {
  return (
    <Button
      fullWidth={!props.small}
      color={props.color || 'info'}
      startIcon={<props.Icon fontSize="small" sx={{ mr: !props.small ? 1 : 0 }} />}
      {...props}
    >
      {props.small ? (
        <Typography sx={{ fontWeight: 300, textTransform: 'capitalize' }}>
          {props.label}
        </Typography>
      ) : (
        props.label
      )}
    </Button>
  )
}
