import * as React from 'react'
import Button from '@mui/material/Button'

interface PreviewButtonProps {
  onClick: () => void
}

export default function PreviewButton(props: PreviewButtonProps) {
  return (
    <Button
      fullWidth
      color="info"
      variant="contained"
      title="Preview descriptor in selected format"
      onClick={() => props.onClick()}
    >
      Commit
    </Button>
  )
}
