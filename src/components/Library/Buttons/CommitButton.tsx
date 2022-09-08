import * as React from 'react'
import Button from '@mui/material/Button'

interface CommitButtonProps {
  variant?: 'contained' | 'outlined'
  disabled?: boolean
  onClick: () => void
}

export default function CommitButton(props: CommitButtonProps) {
  return (
    <Button
      fullWidth
      color="success"
      variant={props.variant || 'contained'}
      title="Commit changes"
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      Commit
    </Button>
  )
}
