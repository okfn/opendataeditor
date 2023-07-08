import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Cancel from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IconButton from '..//Buttons/Icon'
import Columns from '../Grids/Columns'

export interface ConfirmDialogProps {
  open?: boolean
  title?: string
  description?: string
  Icon?: React.ElementType
  label?: string
  disabled?: boolean
  maxWidth?: 'md' | 'xl'
  onCancel?: () => void
  onConfirm?: () => void
}

export default function ConfirmDialog(
  props: React.PropsWithChildren<ConfirmDialogProps>
) {
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
        if (event.ctrlKey && event.key === 'Enter') handleConfirm()
      }}
    >
      <DialogTitle
        id="dialog-title"
        sx={{
          paddingBottom: 1,
          marginBottom: 2,
          borderBottom: 'solid 1px #ddd',
          backgroundColor: '#fafafa',
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
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <IconButton
            fullWidth
            label="Cancel [Esc]"
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
            Icon={Cancel}
          />
          <IconButton
            fullWidth
            label={`${props.label || 'Confirm'} [Ctrl+Enter]`}
            Icon={props.Icon || CheckCircleIcon}
            sx={{ my: 0.5 }}
            onClick={handleConfirm}
            aria-label="accept"
            variant="contained"
            disabled={props.disabled}
          />
        </Columns>
      </Box>
    </Dialog>
  )
}
