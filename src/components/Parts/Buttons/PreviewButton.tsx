import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../settings'

interface PreviewButtonProps {
  onClick: () => void
  variant?: 'contained' | 'outlined' | 'text'
}

export default function PreviewButton(props: PreviewButtonProps) {
  return (
    <Button
      fullWidth
      color="info"
      variant={props.variant || settings.DEFUALT_BUTTON_VARIANT}
      title="Preview descriptor in selected format"
      onClick={() => props.onClick()}
    >
      Commit
    </Button>
  )
}
