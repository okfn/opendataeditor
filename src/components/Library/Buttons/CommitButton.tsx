import * as React from 'react'
import Button from '@mui/material/Button'

interface CommitButtonProps {
  disabled?: boolean
  onClick: () => void
}

export default function CommitButton(props: CommitButtonProps) {
  return (
    <Button
      fullWidth
      color="success"
      variant="outlined"
      title="Commit changes"
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      Commit
    </Button>
  )
}
