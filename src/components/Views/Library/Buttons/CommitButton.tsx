import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../../settings'

interface CommitButtonProps {
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  onClick: () => void
}

export default function CommitButton(props: CommitButtonProps) {
  return (
    <Button
      fullWidth
      color={props.disabled ? 'primary' : 'secondary'}
      variant={props.variant || settings.DEFUALT_BUTTON_VARIANT}
      title="Commit changes"
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      Commit
    </Button>
  )
}
