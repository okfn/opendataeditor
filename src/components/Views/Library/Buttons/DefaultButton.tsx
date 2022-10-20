import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../../settings'

interface DefaultButtonProps {
  label: string
  color?: 'info' | 'warning' | 'secondary'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  onClick: () => void
}

export default function DefaultButton(props: DefaultButtonProps) {
  return (
    <Button
      fullWidth
      disabled={props.disabled}
      variant={props.variant || settings.DEFUALT_BUTTON_VARIANT}
      color={props.color || 'info'}
      onClick={() => props.onClick()}
    >
      {props.label}
    </Button>
  )
}
