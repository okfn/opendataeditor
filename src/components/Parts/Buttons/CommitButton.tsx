import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../settings'

interface CommitButtonProps {
  variant?: 'contained' | 'outlined' | 'text'
  icon?: React.ReactNode
  disabled?: boolean
  onClick: () => void
}

export default function CommitButton(props: CommitButtonProps) {
  return (
    <Button
      fullWidth
      color={props.disabled ? 'primary' : 'secondary'}
      variant={
        props.disabled
          ? 'outlined'
          : props.variant || settings.DEFUALT_PRIMARY_BUTTON_VARIANT
      }
      title="Save the changes"
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      {props.icon} Save
    </Button>
  )
}
