import * as React from 'react'
import Dialog from '@mui/material/Dialog'

export interface BaseDialogProps {
  open?: boolean
  maxWidth?: 'md' | 'xl'
  onCancel?: () => void
}

export default function BaseDialog(props: React.PropsWithChildren<BaseDialogProps>) {
  const handleCancel = () => props.onCancel && props.onCancel()
  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth}
      open={!!props.open}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {props.children}
    </Dialog>
  )
}
