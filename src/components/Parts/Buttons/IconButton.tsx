import * as React from 'react'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'

interface IconButtonProps extends ButtonProps {
  label: string
  Icon: React.ElementType
  small?: boolean
}

export default function IconButton(props: IconButtonProps) {
  return (
    <Button
      fullWidth
      color={props.color || 'info'}
      startIcon={<props.Icon fontSize="small" sx={{ mr: 1 }} />}
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
