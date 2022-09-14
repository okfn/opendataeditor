import * as React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

interface ChangesButtonProps {
  variant?: 'contained' | 'outlined'
  disabled?: boolean
  onDiscard: () => void
  onSave: () => void
}

export default function ChangesButton(props: ChangesButtonProps) {
  return (
    <ButtonGroup fullWidth disabled={props.disabled} variant={props.variant}>
      <Button color="success" title="Save changes" onClick={() => props.onSave()}>
        Save
      </Button>
      <Button color="error" title="Discard changes" onClick={() => props.onDiscard()}>
        Discard
      </Button>
    </ButtonGroup>
  )
}
