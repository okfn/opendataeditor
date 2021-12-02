import * as React from 'react'
import Button from '@mui/material/Button'

interface CommitButtonProps {
  disabled?: boolean
  handleClick: () => void
}

export default function CommitButton(props: CommitButtonProps) {
  return (
    <Button
      fullWidth
      color="success"
      variant="outlined"
      title="Commit changes to use them further"
      disabled={props.disabled}
      onClick={() => props.handleClick()}
    >
      Commit
    </Button>
  )
}
