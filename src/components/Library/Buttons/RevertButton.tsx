import * as React from 'react'
import Button from '@mui/material/Button'

interface RevertButtonProps {
  variant?: 'contained' | 'outlined'
  disabled?: boolean
  onClick: () => void
}

export default function RevertButton(props: RevertButtonProps) {
  return (
    <Button
      fullWidth
      color="error"
      variant={props.variant || 'contained'}
      title="Revert changes"
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      Revert
    </Button>
  )
}
