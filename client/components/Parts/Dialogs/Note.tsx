import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import SimpleButton from '../Buttons/SimpleButton'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export interface NoteDialogProps {
  open?: boolean
  title?: string
  description?: string
  Icon?: React.ElementType
  label?: string
  color?: 'error'
  maxWidth?: 'md' | 'xl'
  onConfirm?: () => void
  onCancel?: () => void
  ctrlEnter?: boolean
  children?: React.ReactNode
}

export default function NoteDialog(props: NoteDialogProps) {
  const handleCancel = () => props.onCancel && props.onCancel()
  const handleConfirm = () => props.onConfirm && props.onConfirm()
  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth}
      open={!!props.open}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onKeyDown={(event) => {
        if ((!props.ctrlEnter || event.ctrlKey) && event.key === 'Enter') handleConfirm()
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle
        id="dialog-title"
        sx={{
          paddingBottom: 1,
          marginBottom: 2,
          borderBottom: 'solid 1px #ddd',
          backgroundColor: (theme) => theme.palette.OKFNGray100.main,
        }}
      >
        {props.title || 'Dialog'}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        {props.description && (
          <Box sx={{ marginBottom: 1, opacity: 0.6 }}>{props.description}</Box>
        )}
        {props.children}
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <SimpleButton
          fullWidth
          label={props.label || 'Confirm'}
          sx={{ my: 0.5 }}
          onClick={handleConfirm}
          aria-label="accept"
          variant="contained"
          color={ props.label === 'Delete' ? 'OKFNRed500' : 'OKFNBlack' }
          disabled={props.disabled || props.loading}
        />
      </Box>
    </Dialog>
  )
}
