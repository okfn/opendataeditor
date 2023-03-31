import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../settings'

// TODO: allow Icon (component not only instance)
interface DefaultButtonProps {
  label: string
  icon?: React.ReactNode
  color?: 'info' | 'warning' | 'secondary' | 'success'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  onClick?: () => void
  white?: boolean
}

export default function DefaultButton(props: DefaultButtonProps) {
  return (
    <Button
      fullWidth
      disabled={props.disabled}
      variant={props.variant || settings.DEFUALT_BUTTON_VARIANT}
      color={props.color || 'info'}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      sx={{ backgroundColor: props.white ? 'white' : undefined }}
    >
      {props.icon} {props.label}
    </Button>
  )
}
