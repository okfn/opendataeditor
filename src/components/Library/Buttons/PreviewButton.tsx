import * as React from 'react'
import Button from '@mui/material/Button'

interface PreviewButtonProps {
  handleClick: () => void
}

export default function PreviewButton(props: PreviewButtonProps) {
  return (
    <Button
      fullWidth
      color="info"
      variant="outlined"
      title="Preview descriptor in selected format"
      onClick={() => props.handleClick()}
    >
      Commit
    </Button>
  )
}
