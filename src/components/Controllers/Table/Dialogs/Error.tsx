import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Cancel from '@mui/icons-material/Cancel'
import IconButton from '../../../Parts/Buttons/Icon'
import { useStore } from '../store'

export default function ErrorDialog() {
  const file = useStore((state) => state.file)
  if (!file) return null
  const dialog = useStore((state) => state.dialog)
  const updateState = useStore((state) => state.updateState)
  const error = useStore((state) => state.error)
  const handleCancel = () => updateState({ dialog: undefined, error: undefined })
  if (!error) return null
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={dialog === 'error'}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{error.title}</DialogTitle>
      <DialogContent sx={{ paddingTop: 0 }}>{error.message}</DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <IconButton
          fullWidth
          label="Close"
          sx={{ my: 0.5 }}
          onClick={handleCancel}
          aria-label="cancel"
          color="warning"
          variant="contained"
          Icon={Cancel}
        />
      </Box>
    </Dialog>
  )
}
