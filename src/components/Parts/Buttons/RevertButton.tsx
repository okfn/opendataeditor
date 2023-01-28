import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../settings'

interface RevertButtonProps {
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  onClick: () => void
}

export default function RevertButton(props: RevertButtonProps) {
  return (
    <Button
      fullWidth
      color={props.disabled ? 'primary' : 'warning'}
      variant={
        props.disabled
          ? 'outlined'
          : props.variant || settings.DEFUALT_PRIMARY_BUTTON_VARIANT
      }
      title="Discard the changes"
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      Discard
    </Button>
  )
}
